"use client";
import type { ComponentProps } from "react";
import { useRef } from "react";
import { Form, useSubmit } from "react-router";

export function FormSubmitOnChange(props: ComponentProps<typeof Form>) {
  const submit = useSubmit();
  const replace = useRef(false);

  return (
    <Form
      {...props}
      onChange={(e) => {
        submit(e.currentTarget, { replace: replace.current });
        replace.current = true;
      }}
    ></Form>
  );
}
