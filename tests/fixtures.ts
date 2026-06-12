import { test as base } from "@playwright/test";

export interface Fixtures {}

export const test = base.extend<Fixtures>({});
