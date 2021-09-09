import React from "react";
import { render, screen } from "@testing-library/react";

const Dummy = () => <div>DUMMY</div>;

describe("app", () => {
  it("should test something (question mark?)", () => {
    render(<Dummy />);
    const dummyElement = screen.getByText(/DUMMY/i);
    expect(dummyElement).toBeInTheDocument();
  });
});
