/**
 * AGENCY CONFIG — edit this file when deploying for a new agency.
 * All agency-specific branding and identity lives here.
 */
export const AGENCY = {
  /** Display name used throughout the UI */
  name: "The Strickland Group",

  /**
   * Brand colors — also update app/globals.css @theme block to match.
   * These are kept here for reference; Tailwind reads them from CSS.
   *
   * primary:       #c2933f   (gold — headers, checkboxes, buttons)
   * primaryLight:  #f6ecd9   (pale gold — checked backgrounds)
   * primaryDark:   #96702c   (darker gold — hover states)
   * warm:          #7c5a3e   (brown — admin accents)
   * warmLight:     #f2ebe3   (pale warm — admin backgrounds)
   * sky:           #a0c3d1   (sky blue — confetti accent)
   * background:    #f4f1ec   (off-white page background)
   * ink:           #17130f   (near-black brown — dark hero sections)
   */

  /**
   * Confetti colors fired when an agent completes a step.
   * Should complement the brand palette.
   */
  confettiColors: ["#c2933f", "#17130f", "#f6ecd9", "#ffffff"],
};
