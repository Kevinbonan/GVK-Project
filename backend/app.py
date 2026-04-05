from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson.json_util import dumps
from bson.objectid import ObjectId
import os
import bcrypt
from datetime import datetime
import pandas as pd
import io
import xlsxwriter
from werkzeug.utils import secure_filename

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None


app = Flask(__name__)


CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})


client = MongoClient('localhost', 27017)



login_manager = LoginManager()
login_manager.init_app(app)


db = client.gvk_database




users = db.users

candidates = db.candidates
jobs = db.jobs
interviews = db.interviews
status_history = db.status_history


app.secret_key = os.urandom(24)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



users.create_index([("username", 1)], unique=True)
jobs.create_index([("title", 1)], unique=True)

PIPELINE_STATUSES = [
    "Applied",
    "HR Interview",
    "Technical Interview",
    "Offer",
    "Hired",
    "Rejected",
]


def serialize_document(document):
    if not document:
        return None
    document["_id"] = str(document["_id"])
    if "candidate_id" in document:
        document["candidate_id"] = str(document["candidate_id"])
    return document


def serialize_list(documents):
    serialized = []
    for document in documents:
        serialized.append(serialize_document(document))
    return serialized


def add_status_history(candidate_id, from_status, to_status, changed_by):
    status_history.insert_one(
        {
            "candidate_id": ObjectId(candidate_id),
            "from_status": from_status,
            "to_status": to_status,
            "changed_at": datetime.utcnow().isoformat(),
            "changed_by": changed_by,
        }
    )


def parse_keywords(keywords):
    if isinstance(keywords, list):
        values = keywords
    else:
        values = str(keywords or "").split(",")
    cleaned_keywords = []
    seen = set()
    for keyword in values:
        normalized = str(keyword).strip()
        lowered = normalized.lower()
        if normalized and lowered not in seen:
            cleaned_keywords.append(normalized)
            seen.add(lowered)
    return cleaned_keywords


def parse_threshold(value, default=60):
    try:
        return max(0, min(100, int(value)))
    except (TypeError, ValueError):
        return default


def extract_text_from_pdf(file_path):
    if PdfReader is None:
        raise RuntimeError("PDF parsing library is not installed")

    reader = PdfReader(file_path)
    pages_text = []
    for page in reader.pages:
        pages_text.append(page.extract_text() or "")
    return "\n".join(pages_text)


def analyze_cv_text(cv_text, keywords):
    normalized_text = cv_text.lower()
    matched_keywords = []
    missing_keywords = []

    for keyword in keywords:
        if keyword.lower() in normalized_text:
            matched_keywords.append(keyword)
        else:
            missing_keywords.append(keyword)

    score = round((len(matched_keywords) / len(keywords)) * 100, 2) if keywords else 0
    return {
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "match_score": score,
    }




class User(UserMixin):
    def __init__(self, username, password, id, isAdmin):
        self.username = username
        self.password = password
        self.id = id
        self.isAdmin = isAdmin

    def get_id(self):
        return self.id


@login_manager.user_loader
def load_user(user_id):
    user = users.find_one({"_id": ObjectId(user_id)})
    if user:
        return User(username=user['username'], password=user['password'], id=str(user['_id']), isAdmin=user["isAdmin"])
    return None


@app.route('/create_admin', methods=['GET'])
def create_admin():
    user_data = {"username": "admin", "password": "password", "isAdmin": True}
    user_data['password'] = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
    try:
        users.insert_one(user_data)
        return jsonify({"message": "Admin user created successfully."}), 201
    except DuplicateKeyError:
        return jsonify({"message": "Admin user already exists."}), 200




@app.route('/get_users', methods=['GET'])
@login_required
def get_users():
    users_list = users.find() 
    users_list = [user for user in users_list] 
    for user in users_list:
        user['_id'] = str(user['_id']) 
    return jsonify(users_list), 200 


@app.route('/', methods=['GET'])
def get_message():
    return "Python Flask Backend Server is running!!"

@app.route('/insert_candidate', methods=["POST"])
def insert_candidate():
    candidate = request.json
    organized_candidate = {key:value for (key, value) in candidate["candidate"].items()}
    organized_candidate.setdefault("status", "Applied")
    organized_candidate.setdefault("created_at", datetime.utcnow().isoformat())
    organized_candidate["updated_at"] = datetime.utcnow().isoformat()
    candidates.insert_one(organized_candidate)
    return jsonify({"message": "המועמד נוסף למסד הנתונים"}), 200


@app.route('/deleteCandidate/<id>', methods=["DELETE"])
def delete_candidate(id):
    result = candidates.delete_one({'_id': ObjectId(id)})
    
    if result.deleted_count == 1:
        return jsonify({"message": "המועמד נמחק"}), 200
    else:
        return jsonify({"error": "המועמד לא נמצא"}), 404


@app.route('/login', methods=["POST"])
def login():
    data = request.json
    username_input = data.get('username')
    password_input = data.get('password')


    user_from_db = users.find_one({'username': username_input})

    if user_from_db:
        if bcrypt.checkpw(password_input.encode('utf-8'), user_from_db['password']):
            user_obj = User(username=user_from_db['username'], password=user_from_db['password'], id=str(user_from_db['_id']), isAdmin=user_from_db["isAdmin"])
            login_user(user_obj) 

            print(current_user.is_authenticated)
            print(current_user.username)


            return jsonify({"message": "התחברת בהצלחה", "username": current_user.username , "isAuthenticated": current_user.is_authenticated}), 200
        else:
            return jsonify({"message": "אחד או יותר מפרטי ההזדהות שמסרת שגויים"}), 401   
    else:
        return jsonify({"message": "שם המשתמש שהזנת לא קיים"}), 404    



@app.route('/logout', methods=["POST"])
@login_required  
def logout():
    logout_user()  
    return jsonify({"message": "התנתקת בהצלחה"}), 200  


# @app.route('/create_candidate', methods=['GET'])
# def create_candidate():
#     today = datetime.today().strftime('%Y-%m-%d')
#     candidate_data = {"stage": 1, "name": "matan ohana", "job": "technician", "phone_sum": "bla bla", "phone_sum_date": today, "interview_sum": "bla bla", "years_exp": 2.5, "security_clearance": False, "safety": True, "101": False, "interview_date": today, "grade": 5, "field_exp": "yada yada", "add_info": "", "user_added": "admin"}
#     candidates.insert_one(candidate_data)
#     return 'Candidate Created'


@app.route('/allCandidates')
@login_required
def allCandidates():
    candidates_list = candidates.find() 
    candidates_list = [candidate for candidate in candidates_list] 
    for candidate in candidates_list:
        candidate['_id'] = str(candidate['_id']) 
    return jsonify(candidates_list), 200 


@app.route("/candidates", methods=["GET"])
@login_required
def list_candidates():
    status_filter = request.args.get("status")
    job_filter = request.args.get("job")
    query = {}
    if status_filter:
        query["status"] = status_filter
    if job_filter:
        query["תפקיד"] = job_filter
    candidates_list = candidates.find(query)
    return jsonify(serialize_list(candidates_list)), 200


@app.route("/candidates/<candidate_id>", methods=["GET"])
@login_required
def get_candidate(candidate_id):
    candidate = candidates.find_one({"_id": ObjectId(candidate_id)})
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify(serialize_document(candidate)), 200


@app.route("/candidates/<candidate_id>/status", methods=["PUT"])
@login_required
def update_candidate_status(candidate_id):
    payload = request.json or {}
    new_status = payload.get("status")
    if new_status not in PIPELINE_STATUSES:
        return jsonify({"error": "Invalid status"}), 400
    candidate = candidates.find_one({"_id": ObjectId(candidate_id)})
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404
    previous_status = candidate.get("status", "Applied")
    candidates.update_one(
        {"_id": ObjectId(candidate_id)},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow().isoformat()}},
    )
    add_status_history(candidate_id, previous_status, new_status, current_user.username)
    return jsonify({"message": "Status updated"}), 200


@app.route("/candidates/<candidate_id>/interviews", methods=["POST"])
@login_required
def add_interview(candidate_id):
    payload = request.json or {}
    interview = {
        "candidate_id": ObjectId(candidate_id),
        "type": payload.get("type"),
        "date": payload.get("date"),
        "interviewer": payload.get("interviewer"),
        "notes": payload.get("notes"),
        "score": payload.get("score"),
        "created_at": datetime.utcnow().isoformat(),
    }
    interviews.insert_one(interview)
    return jsonify({"message": "Interview added"}), 201


@app.route("/candidates/<candidate_id>/interviews", methods=["GET"])
@login_required
def list_interviews(candidate_id):
    interviews_list = interviews.find({"candidate_id": ObjectId(candidate_id)})
    return jsonify(serialize_list(interviews_list)), 200


@app.route("/candidates/<candidate_id>/history", methods=["GET"])
@login_required
def list_history(candidate_id):
    history_list = status_history.find({"candidate_id": ObjectId(candidate_id)}).sort(
        "changed_at", 1
    )
    return jsonify(serialize_list(history_list)), 200


@app.route("/jobs", methods=["POST"])
@login_required
def create_job():
    payload = request.json or {}
    threshold = parse_threshold(payload.get("match_threshold", 60))
    job = {
        "title": payload.get("title"),
        "department": payload.get("department"),
        "location": payload.get("location"),
        "status": payload.get("status", "open"),
        "keywords": parse_keywords(payload.get("keywords", [])),
        "match_threshold": threshold,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    result = jobs.insert_one(job)
    job["_id"] = str(result.inserted_id)
    return jsonify(job), 201


@app.route("/jobs", methods=["GET"])
@login_required
def list_jobs():
    jobs_list = jobs.find()
    return jsonify(serialize_list(jobs_list)), 200


@app.route("/jobs/<job_id>", methods=["PUT"])
@login_required
def update_job(job_id):
    payload = request.json or {}
    if "keywords" in payload:
        payload["keywords"] = parse_keywords(payload.get("keywords"))
    if "match_threshold" in payload:
        payload["match_threshold"] = parse_threshold(payload.get("match_threshold", 60))
    payload["updated_at"] = datetime.utcnow().isoformat()
    jobs.update_one({"_id": ObjectId(job_id)}, {"$set": payload})
    job = jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(serialize_document(job)), 200


@app.route("/jobs/<job_id>", methods=["DELETE"])
@login_required
def delete_job(job_id):
    result = jobs.delete_one({"_id": ObjectId(job_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Job deleted"}), 200
    return jsonify({"error": "Job not found"}), 404


@app.route('/updateCandidate/<id>', methods=['PUT'])
def update_candidate(id):
    data = request.json  
    
    if "_id" in data:
        data.pop("_id")
    data["updated_at"] = datetime.utcnow().isoformat()

 
    updated_candidate = candidates.find_one_and_update(
        {'_id': ObjectId(id)},
        {'$set': data},
        return_document=True  
    )

    if updated_candidate:

        updated_candidate['_id'] = str(updated_candidate['_id'])
        return jsonify({"message": "המועמד עודכן בהצלחה", "updated_candidate": updated_candidate}), 200
    else:
        return jsonify({"error": "מועמד לא נמצא"}), 404
    


@app.route('/export_candidates', methods=['GET'])
def export_candidates():

    candidates_data = list(candidates.find({}))
    

    df = pd.DataFrame(candidates_data)
    

    if '_id' in df.columns:
        df.drop(columns=['_id'], inplace=True)
    

    output = io.BytesIO()
    

    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Candidates')
    

    output.seek(0)
    

    return send_file(output, as_attachment=True, download_name='candidates.xlsx', mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')


@app.route("/candidates/<candidate_id>/analyze-cv", methods=["POST"])
@login_required
def analyze_candidate_cv(candidate_id):
    candidate = candidates.find_one({"_id": ObjectId(candidate_id)})
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404

    if "cv" not in request.files:
        return jsonify({"error": "Missing PDF file"}), 400

    uploaded_file = request.files["cv"]
    if not uploaded_file or uploaded_file.filename == "":
        return jsonify({"error": "Missing PDF file"}), 400

    if not uploaded_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    job_id = request.form.get("job_id")
    if not job_id:
        return jsonify({"error": "Missing job selection"}), 400

    job = jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        return jsonify({"error": "Job not found"}), 404

    keywords = parse_keywords(job.get("keywords", []))
    if not keywords:
        return jsonify({"error": "This job has no keywords configured"}), 400
    threshold = parse_threshold(job.get("match_threshold", 60))

    safe_name = secure_filename(uploaded_file.filename)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    stored_filename = f"{candidate_id}_{timestamp}_{safe_name}"
    stored_path = os.path.join(UPLOAD_FOLDER, stored_filename)
    uploaded_file.save(stored_path)

    try:
        extracted_text = extract_text_from_pdf(stored_path)
    except RuntimeError:
        return jsonify(
            {"error": "PDF analysis dependency is missing. Install 'pypdf' in the backend environment."}
        ), 500
    except Exception:
        return jsonify({"error": "Unable to read the PDF content"}), 400

    analysis = analyze_cv_text(extracted_text, keywords)
    analysis_payload = {
        "job_id": str(job["_id"]),
        "job_title": job.get("title"),
        "keywords": keywords,
        "matched_keywords": analysis["matched_keywords"],
        "missing_keywords": analysis["missing_keywords"],
        "match_score": analysis["match_score"],
        "match_threshold": threshold,
        "is_match": analysis["match_score"] >= threshold,
        "cv_filename": safe_name,
        "analyzed_at": datetime.utcnow().isoformat(),
        "analyzed_by": current_user.username,
    }

    candidates.update_one(
        {"_id": ObjectId(candidate_id)},
        {
            "$set": {
                "cv_analysis": analysis_payload,
                "updated_at": datetime.utcnow().isoformat(),
            }
        },
    )

    return jsonify(analysis_payload), 200

        



if __name__ == '__main__':
    app.run(debug=True, port=5000)
