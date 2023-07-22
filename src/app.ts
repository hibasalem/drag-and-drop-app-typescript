
/// <reference path="components/user-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  new UserInput();
  new ProjectList('active');
  new ProjectList('finished');
}