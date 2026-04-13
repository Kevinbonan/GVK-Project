from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    logout_user,
    login_required,
    current_user,
)
from pymongo import MongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from bson.errors import InvalidId
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
app.config["SECRET_KEY"] = os.environ.get(
    "FLASK_SECRET_KEY",
    "gvk-local-dev-secret-key",
)

frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": frontend_origin}})

client = MongoClient("localhost", 27017)

login_manager = LoginManager()
login_manager.init_app(app)

db = client.gvk_database

users = db.users
candidates = db.candidates
jobs = db.jobs
interviews = db.interviews
status_history = db.status_history

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


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Authentication required"}), 401


def serialize_document(document):
    if not document:
        return None

    document["_id"] = str(document["_id"])
    if "candidate_id" in document:
        document["candidate_id"] = str(document["candidate_id"])
    return document


def serialize_list(documents):
    return [serialize_document(document) for document in documents]


def parse_object_id(value):
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


def get_object_id_or_error(value, field_name):
    object_id = parse_object_id(value)
    if object_id is None:
        return None, (jsonify({"error": f"Invalid {field_name}"}), 400)
    return object_id, None


def add_status_history(candidate_object_id, from_status, to_status, changed_by):
    status_history.insert_one(
        {
            "candidate_id": candidate_object_id,
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


def bootstrap_admin_from_env():
    username = os.environ.get("GVK_BOOTSTRAP_ADMIN_USERNAME")
    password = os.environ.get("GVK_BOOTSTRAP_ADMIN_PASSWORD")

    if not username or not password:
        return

    if users.find_one({"username": username}):
        return

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    try:
        users.insert_one(
            {
                "username": username,
                "password": hashed_password,
                "isAdmin": True,
            }
        )
    except DuplicateKeyError:
        pass


bootstrap_admin_from_env()


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
    user_object_id = parse_object_id(user_id)
    if user_object_id is None:
        return None

    user = users.find_one({"_id": user_object_id})
    if user:
        return User(
            username=user["username"],
            password=user["password"],
            id=str(user["_id"]),
            isAdmin=user["isAdmin"],
        )
    return None


@app.route("/get_users", methods=["GET"])
@login_required
def get_users():
    users_list = list(users.find({}, {"password": 0}))
    for user in users_list:
        user["_id"] = str(user["_id"])
    return jsonify(users_list), 200


@app.route("/", methods=["GET"])
def get_message():
    return "Python Flask Backend Server is running!!"


@app.route("/session", methods=["GET"])
def session_status():
    if current_user.is_authenticated:
        return (
            jsonify(
                {
                    "isAuthenticated": True,
                    "username": current_user.username,
                    "isAdmin": current_user.isAdmin,
                }
            ),
            200,
        )

    return jsonify({"isAuthenticated": False}), 200


@app.route("/insert_candidate", methods=["POST"])
@login_required
def insert_candidate():
    payload = request.json or {}
    if not isinstance(payload.get("candidate"), dict):
        return jsonify({"error": "Missing candidate payload"}), 400

    organized_candidate = {key: value for (key, value) in payload["candidate"].items()}
    organized_candidate.setdefault("status", "Applied")
    organized_candidate.setdefault("created_at", datetime.utcnow().isoformat())
    organized_candidate["updated_at"] = datetime.utcnow().isoformat()
    candidates.insert_one(organized_candidate)
    return jsonify({"message": "׳”׳׳•׳¢׳׳“ ׳ ׳•׳¡׳£ ׳׳׳¡׳“ ׳”׳ ׳×׳•׳ ׳™׳"}), 200


@app.route("/deleteCandidate/<id>", methods=["DELETE"])
@login_required
def delete_candidate(id):
    candidate_object_id, error_response = get_object_id_or_error(id, "candidate id")
    if error_response:
        return error_response

    result = candidates.delete_one({"_id": candidate_object_id})
    if result.deleted_count == 1:
        return jsonify({"message": "׳”׳׳•׳¢׳׳“ ׳ ׳׳—׳§"}), 200
    return jsonify({"error": "׳”׳׳•׳¢׳׳“ ׳׳ ׳ ׳׳¦׳"}), 404


@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    username_input = str(data.get("username", "")).strip()
    password_input = data.get("password")

    if not username_input or not password_input:
        return jsonify({"message": "Username and password are required"}), 400

    user_from_db = users.find_one({"username": username_input})

    if user_from_db:
        if bcrypt.checkpw(password_input.encode("utf-8"), user_from_db["password"]):
            user_obj = User(
                username=user_from_db["username"],
                password=user_from_db["password"],
                id=str(user_from_db["_id"]),
                isAdmin=user_from_db["isAdmin"],
            )
            login_user(user_obj)
            return (
                jsonify(
                    {
                        "message": "׳”׳×׳—׳‘׳¨׳× ׳‘׳”׳¦׳׳—׳”",
                        "username": current_user.username,
                        "isAuthenticated": current_user.is_authenticated,
                    }
                ),
                200,
            )
        return (
            jsonify(
                {
                    "message": "׳׳—׳“ ׳׳• ׳™׳•׳×׳¨ ׳׳₪׳¨׳˜׳™ ׳”׳”׳–׳“׳”׳•׳× ׳©׳׳¡׳¨׳× ׳©׳’׳•׳™׳™׳"
                }
            ),
            401,
        )

    return jsonify({"message": "׳©׳ ׳”׳׳©׳×׳׳© ׳©׳”׳–׳ ׳× ׳׳ ׳§׳™׳™׳"}), 404


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "׳”׳×׳ ׳×׳§׳× ׳‘׳”׳¦׳׳—׳”"}), 200


@app.route("/allCandidates")
@login_required
def allCandidates():
    candidates_list = list(candidates.find())
    for candidate in candidates_list:
        candidate["_id"] = str(candidate["_id"])
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
        query["$or"] = [
            {"׳×׳₪׳§׳™׳“": job_filter},
            {"ֳƒג€”ֳ‚ֲ×ֳƒג€”ֳ‚ֲ₪ֳƒג€”ֳ‚ֲ§ֳƒג€”ֳ¢ג€ֲ¢ֳƒג€”ֳ¢ג‚¬ֵ“": job_filter},
        ]

    candidates_list = candidates.find(query)
    return jsonify(serialize_list(candidates_list)), 200


@app.route("/candidates/<candidate_id>", methods=["GET"])
@login_required
def get_candidate(candidate_id):
    candidate_object_id, error_response = get_object_id_or_error(
        candidate_id, "candidate id"
    )
    if error_response:
        return error_response

    candidate = candidates.find_one({"_id": candidate_object_id})
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404
    return jsonify(serialize_document(candidate)), 200


@app.route("/candidates/<candidate_id>/status", methods=["PUT"])
@login_required
def update_candidate_status(candidate_id):
    candidate_object_id, error_response = get_object_id_or_error(
        candidate_id, "candidate id"
    )
    if error_response:
        return error_response

    payload = request.json or {}
    new_status = payload.get("status")
    if new_status not in PIPELINE_STATUSES:
        return jsonify({"error": "Invalid status"}), 400

    candidate = candidates.find_one({"_id": candidate_object_id})
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404

    previous_status = candidate.get("status", "Applied")
    candidates.update_one(
        {"_id": candidate_object_id},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow().isoformat()}},
    )
    add_status_history(
        candidate_object_id,
        previous_status,
        new_status,
        current_user.username,
    )
    return jsonify({"message": "Status updated"}), 200


@app.route("/candidates/<candidate_id>/interviews", methods=["POST"])
@login_required
def add_interview(candidate_id):
    candidate_object_id, error_response = get_object_id_or_error(
        candidate_id, "candidate id"
    )
    if error_response:
        return error_response

    if not candidates.find_one({"_id": candidate_object_id}):
        return jsonify({"error": "Candidate not found"}), 404

    payload = request.json or {}
    interview = {
        "candidate_id": candidate_object_id,
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
    candidate_object_id, error_response = get_object_id_or_error(
        candidate_id, "candidate id"
    )
    if error_response:
        return error_response

    interviews_list = interviews.find({"candidate_id": candidate_object_id})
    return jsonify(serialize_list(interviews_list)), 200


@app.route("/candidates/<candidate_id>/history", methods=["GET"])
@login_required
def list_history(candidate_id):
    candidate_object_id, error_response = get_object_id_or_error(
        candidate_id, "candidate id"
    )
    if error_response:
        return error_response

    history_list = status_history.find({"candidate_id": candidate_object_id}).sort(
        "changed_at", 1
    )
    return jsonify(serialize_list(history_list)), 200


@app.route("/jobs", methods=["POST"])
@login_required
def create_job():
    payload = request.json or {}
    title = str(payload.get("title", "")).strip()
    if not title:
        return jsonify({"error": "Job title is required"}), 400

    threshold = parse_threshold(payload.get("match_threshold", 60))
    job = {
        "title": title,
        "department": payload.get("department"),
        "location": payload.get("location"),
        "status": payload.get("status", "open"),
        "keywords": parse_keywords(payload.get("keywords", [])),
        "match_threshold": threshold,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }

    try:
        result = jobs.insert_one(job)
    except DuplicateKeyError:
        return jsonify({"error": "A job with this title already exists"}), 409

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
    job_object_id, error_response = get_object_id_or_error(job_id, "job id")
    if error_response:
        return error_response

    existing_job = jobs.find_one({"_id": job_object_id})
    if not existing_job:
        return jsonify({"error": "Job not found"}), 404

    payload = request.json or {}
    if "title" in payload:
        title = str(payload.get("title", "")).strip()
        if not title:
            return jsonify({"error": "Job title is required"}), 400
        payload["title"] = title
    if "keywords" in payload:
        payload["keywords"] = parse_keywords(payload.get("keywords"))
    if "match_threshold" in payload:
        payload["match_threshold"] = parse_threshold(payload.get("match_threshold", 60))

    payload["updated_at"] = datetime.utcnow().isoformat()

    try:
        jobs.update_one({"_id": job_object_id}, {"$set": payload})
    except DuplicateKeyError:
        return jsonify({"error": "A job with this title already exists"}), 409

    job = jobs.find_one({"_id": job_object_id})
    return jsonify(serialize_document(job)), 200


@app.route("/jobs/<job_id>", methods=["DELETE"])
@login_required
def delete_job(job_id):
    job_object_id, error_response = get_object_id_or_error(job_id, "job id")
    if error_response:
        return error_response

    result = jobs.delete_one({"_id": job_object_id})
    if result.deleted_count == 1:
        return jsonify({"message": "Job deleted"}), 200
    return jsonify({"error": "Job not found"}), 404


@app.route("/updateCandidate/<id>", methods=["PUT"])
@login_required
def update_candidate(id):
    candidate_object_id, error_response = get_object_id_or_error(id, "candidate id")
    if error_response:
        return error_response

    data = request.json or {}
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid update payload"}), 400

    if "_id" in data:
        data.pop("_id")
    data["updated_at"] = datetime.utcnow().isoformat()

    updated_candidate = candidates.find_one_and_update(
        {"_id": candidate_object_id},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )

    if updated_candidate:
        updated_candidate["_id"] = str(updated_candidate["_id"])
        return (
            jsonify(
                {
                    "message": "׳”׳׳•׳¢׳׳“ ׳¢׳•׳“׳›׳ ׳‘׳”׳¦׳׳—׳”",
                    "updated_candidate": updated_candidate,
                }
            ),
            200,
        )
    return jsonify({"error": "׳׳•׳¢׳׳“ ׳׳ ׳ ׳׳¦׳"}), 404


@app.route("/export_candidates", methods=["GET"])
@login_required
def export_candidates():
    candidates_data = list(candidates.find({}))
    df = pd.DataFrame(candidates_data)

    if "_id" in df.columns:
        df.drop(columns=["_id"], inplace=True)

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Candidates")

    output.seek(0)
    return send_file(
        output,
        as_attachment=True,
        download_name="candidates.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.route("/candidates/<candidate_id>/analyze-cv", methods=["POST"])
@login_required
def analyze_candidate_cv(candidate_id):
    candidate_object_id, error_response = get_object_id_or_error(
        candidate_id, "candidate id"
    )
    if error_response:
        return error_response

    candidate = candidates.find_one({"_id": candidate_object_id})
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

    job_object_id, error_response = get_object_id_or_error(job_id, "job id")
    if error_response:
        return error_response

    job = jobs.find_one({"_id": job_object_id})
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
        return (
            jsonify(
                {
                    "error": "PDF analysis dependency is missing. Install 'pypdf' in the backend environment."
                }
            ),
            500,
        )
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
        {"_id": candidate_object_id},
        {
            "$set": {
                "cv_analysis": analysis_payload,
                "updated_at": datetime.utcnow().isoformat(),
            }
        },
    )

    return jsonify(analysis_payload), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
