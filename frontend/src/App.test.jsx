import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import App, { BASE_URL } from "./App";

jest.mock("axios");

test("renders the login page for signed-out users", async () => {
  axios.get.mockResolvedValue({ data: { isAuthenticated: false } });
  render(<App />);

  await waitFor(() =>
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/session`, {
      withCredentials: true,
    })
  );

  expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
});
