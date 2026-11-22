// Registers this website's operations with the agent runtime.
// agent-manifest.json loads this module through "actions.module". Only the names in
// "actions.agentTools" become model tools, called website_<name>.
//
// Operations return {ok: false, reason, field} when they refuse input, before changing
// anything, and throw only on unexpected failures. A throw is reported as "unknown".
// Import the page object by the same URL the page uses (no ?v= query), or the actions
// get a second, separate copy of the page state.
import { PortfolioPage } from "./portfolio-page.js";

// Section ids and project names, from src/site-content.ts. The test suite checks
// these enums match the names website_get_portfolio_state returns.
const SECTION_IDS = ["home", "about", "work", "certifications", "services", "contact"];
const PROJECT_NAMES = [
  "ML Playground",
  "LeafGuard",
  "Bareskrim Rekrutmen",
  "Smart Home Energy Monitoring",
  "DuaFrame",
  "Kopi Rush",
  "Token Radar",
  "AI Job Agent",
];

/**
 * Describes the site's operations as actions the agents can call.
 *
 * Each action wraps a function the page already uses, so the assistant and the manual
 * UI share one set of rules. The runtime validates arguments against inputSchema before
 * execute runs, and asks the visitor to confirm "irreversible" actions first.
 */
class SiteActions {
  /**
   * Register every site action with the runtime.
   *
   * :param actions: The runtime registry facade with a register(definition) method.
   */
  static registerActions(actions) {
    actions.register(SiteActions.readStateAction());
    actions.register(SiteActions.navigateToSectionAction());
    actions.register(SiteActions.openProjectLinkAction());
    actions.register(SiteActions.copyEmailAction());
  }

  /**
   * Describe the read action that returns the page's data and current state.
   *
   * :return: The action definition.
   */
  static readStateAction() {
    return {
      name: "get_portfolio_state",
      // The model reads each description to choose a tool. Say when to call it and what
      // to call before it here, not in the agent's instructions.
      description: "Read the actual portfolio data: profile, education, projects, skills, certifications, services, contact links, sections, the current section and today's date. Call it before answering about Muhammad or the portfolio, and again in each turn that needs it: the visitor can also use the page.",
      effect: "read",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute: SiteActions.readState,
    };
  }

  /**
   * Return a fresh copy of the page state.
   *
   * :return: The page state as plain JSON data.
   */
  static readState() {
    return PortfolioPage.getState();
  }

  /**
   * Describe the reversible write that scrolls the page to a section.
   *
   * :return: The action definition.
   */
  static navigateToSectionAction() {
    return {
      name: "navigate_to_section",
      description: "Scroll the page to one of its sections and update the address hash, only when the visitor asks to be shown that section. Returns the section shown. The visitor can scroll back.",
      // "write" runs immediately. Use it only for changes the visitor can undo on the page.
      effect: "write",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["section"],
        properties: {
          // An enum of real IDs stops the model from inventing sections.
          section: {
            type: "string",
            enum: SECTION_IDS,
            description: "Section id from website_get_portfolio_state.",
          },
        },
      },
      execute: SiteActions.navigateToSection,
    };
  }

  /**
   * Scroll through the page's own navigation function.
   *
   * :param args: The validated arguments with the section id.
   * :return: The section shown, or {ok: false, reason} when the site refuses it.
   */
  static navigateToSection(args) {
    return PortfolioPage.navigateToSection(args.section);
  }

  /**
   * Describe the reversible write that opens a project's link in a new tab.
   *
   * :return: The action definition.
   */
  static openProjectLinkAction() {
    return {
      name: "open_project_link",
      description: "Open a project's link in a new tab, only when the visitor asks for it. Use a project name from website_get_portfolio_state. Returns the link opened, or ok false with a reason and the link when the browser blocks the new tab or the project has no public link.",
      // "write" runs immediately. Use it only for changes the visitor can undo on the page.
      effect: "write",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["project"],
        properties: {
          // An enum of real names stops the model from inventing projects.
          project: {
            type: "string",
            enum: PROJECT_NAMES,
            description: "Project name from website_get_portfolio_state.",
          },
        },
      },
      execute: SiteActions.openProjectLink,
    };
  }

  /**
   * Open the link through the page object's own function.
   *
   * :param args: The validated arguments with the project name.
   * :return: The link opened, or {ok: false, reason, link} when it could not be opened.
   */
  static openProjectLink(args) {
    return PortfolioPage.openProjectLink(args.project);
  }

  /**
   * Describe the reversible write that copies the email address.
   *
   * :return: The action definition.
   */
  static copyEmailAction() {
    return {
      name: "copy_email",
      description: "Copy Muhammad's email address (muhadilaga07@gmail.com) to the clipboard, only when the visitor asks for it. Returns the email copied, or ok false with a reason when the clipboard is not available in this browser.",
      // "write" runs immediately. Use it only for changes the visitor can undo on the page.
      effect: "write",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute: SiteActions.copyEmail,
    };
  }

  /**
   * Copy the email through the page object's own function.
   *
   * :return: The email copied, or {ok: false, reason} when the clipboard is unavailable.
   */
  static copyEmail() {
    return PortfolioPage.copyEmail();
  }
}

// The runtime calls the module's registerActions export.
export const registerActions = SiteActions.registerActions;
