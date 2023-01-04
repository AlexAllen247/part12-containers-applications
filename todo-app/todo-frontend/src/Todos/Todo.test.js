import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Todo from "./Todo";

test("component renders", () => {
  const exampleTodo = {
    text: "example todo",
    done: false,
  };

  const onClickDelete = (todo) => () => {
    return null;
  };

  const onClickComplete = (todo) => () => {
    return null;
  };

  render(
    <Todo
      todo={exampleTodo}
      onClickComplete={onClickComplete}
      onClickDelete={onClickDelete}
    />
  );

  const name = screen.getByText("example todo");
  expect(name).toBeDefined();
});
