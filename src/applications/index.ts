import AppCalculator from "./AppCalculator";
import AppGithub from "./AppGithub";
import AppLinkedin from "./AppLinkedin";
import AppTerminal from "./AppTerminal";
import AppWnfa from "./AppWnfa";
import AppPortfolio from "./AppPortfolio";

import * as AppVue from "./components";

import { AppName, ApplicationMeta } from "../types/TypeApplication";

declare module "../types/TypeApplication" {
  // names
  type AppNameInternal = "terminal" | "calculator" | "wnfa" | "portfolio";
  type AppNameExternal = "github" | "linkedin";
  type AppNameAction = "reset" | "menu";

  // object class
  type AppObjectClassInternal =
    | typeof AppTerminal
    | typeof AppCalculator
    | typeof AppWnfa
    | typeof AppPortfolio;
  type AppObjectClassExternal = typeof AppGithub | typeof AppLinkedin;

  // vue components
  type AppVueComponent =
    | typeof AppVue.AppCalculator
    | typeof AppVue.AppTerminal
    | typeof AppVue.AppWnfa
    | typeof AppVue.AppPortfolio;
}

const applicationActionBar: AppName[] = [];
const applicationMenu: AppName[] = ["github", "linkedin", "wnfa", "calculator"];
const APPLICATION_INDEX: Record<AppName, ApplicationMeta> = {
  portfolio: {
    name: "portfolio",
    type: "internal",
    nameDisplay: "Portfolio",
    description: "A portfolio of my projects",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M37.9062 37.8612H12.1491V12.0771H37.9062V37.8612ZM15.9034 34.23H34.3381V15.513H15.9034V34.23Z" fill="${style.color}"/>
        <path d="M37.9242 1H34.0437V8.83608H37.9242V1Z" fill="${style.color}"/>
        <path d="M15.8914 1H12.0109V8.95923H15.8914V1Z" fill="${style.color}"/>
        <path d="M37.8612 41.051H34.0437V48.824H37.8612V41.051Z" fill="${style.color}"/>
        <path d="M15.8914 41.051H12.0109V49.0103H15.8914V41.051Z" fill="${style.color}"/>
        <path d="M48.6828 34.0437H41.051V38.0294H48.6828V34.0437Z" fill="${style.color}"/>
        <path d="M8.57176 34.0437H1V37.8011H8.57176V34.0437Z" fill="${style.color}"/>
        <path d="M48.9982 12.011H41.051V15.8284H48.9982V12.011Z" fill="${style.color}"/>
        <path d="M8.82106 12.011H1V15.8854H8.82106V12.011Z" fill="${style.color}"/>
      </svg>
    `,
    vueComponent: AppVue.AppPortfolio,
    objectClass: AppPortfolio,
  },
  terminal: {
    name: "terminal",
    type: "internal",
    nameDisplay: "Console",
    description: "A system console to control DEVUE",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.80355 40L5.00396 37.248L17.4616 24.9981L5 12.752L7.7996 10L23.0607 24.9981L7.80355 40ZM46 38.622H26.2009V34.7295H46V38.622Z" fill="${style.color}"/>
      </svg>
    `,
    vueComponent: AppVue.AppTerminal,
    objectClass: AppTerminal,
  },
  calculator: {
    name: "calculator",
    type: "internal",
    nameDisplay: "Calculator",
    description: "A calculator for arithmetic operations",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.85863 6.85764C11.6725 4.04452 15.8535 3 21.1345 3H29.2902C34.5712 3 38.7523 4.04452 41.5661 6.85764C44.3799 9.67076 45.4247 13.8508 45.4247 19.1304V31.3608C45.4247 36.6404 44.3799 40.8204 41.5661 43.6335C38.7523 46.4466 34.5712 47.4911 29.2902 47.4911H21.1345C15.8535 47.4911 11.6725 46.4466 8.85863 43.6335C6.04479 40.8204 5 36.6404 5 31.3608V19.1304C5 13.8508 6.04479 9.67075 8.85863 6.85764ZM11.4919 9.49027C9.7182 11.2636 8.72406 14.218 8.72406 19.1304V31.3608C8.72406 36.2732 9.7182 39.2276 11.4919 41.0008C13.2657 42.7741 16.2208 43.768 21.1345 43.768H29.2902C34.2039 43.768 37.159 42.7741 38.9328 41.0008C40.7065 39.2276 41.7007 36.2732 41.7007 31.3608V19.1304C41.7007 14.218 40.7065 11.2636 38.9328 9.49027C37.159 7.71699 34.2039 6.72311 29.2902 6.72311H21.1345C16.2208 6.72311 13.2657 7.71699 11.4919 9.49027ZM19.0956 15.0397C18.4397 15.0397 17.8992 15.5843 17.8992 16.2357V18.2741C17.8992 18.9299 18.444 19.4703 19.0956 19.4703H31.3291C31.985 19.4703 32.5255 18.9257 32.5255 18.2741V16.2357C32.5255 15.572 31.9931 15.0397 31.3291 15.0397H19.0956ZM14.1752 16.2357C14.1752 13.5442 16.3668 11.3166 19.0956 11.3166H31.3291C34.0498 11.3166 36.2496 13.5158 36.2496 16.2357V18.2741C36.2496 20.9656 34.0579 23.1934 31.3291 23.1934H19.0956C16.4033 23.1934 14.1752 21.0021 14.1752 18.2741V16.2357ZM15.4722 29.3224C15.4722 28.2943 16.3058 27.4608 17.3342 27.4608H17.3577C18.3861 27.4608 19.2198 28.2943 19.2198 29.3224C19.2198 30.3505 18.3861 31.1839 17.3577 31.1839H17.3342C16.3058 31.1839 15.4722 30.3505 15.4722 29.3224ZM23.3405 29.3224C23.3405 28.2943 24.1742 27.4608 25.2026 27.4608H25.2262C26.2546 27.4608 27.0883 28.2943 27.0883 29.3224C27.0883 30.3505 26.2546 31.1839 25.2262 31.1839H25.2026C24.1742 31.1839 23.3405 30.3505 23.3405 29.3224ZM31.2092 29.3224C31.2092 28.2943 32.0428 27.4608 33.0712 27.4608H33.0946C34.123 27.4608 34.9567 28.2943 34.9567 29.3224C34.9567 30.3505 34.123 31.1839 33.0946 31.1839H33.0712C32.0428 31.1839 31.2092 30.3505 31.2092 29.3224ZM15.4722 36.4568C15.4722 35.4287 16.3058 34.5952 17.3342 34.5952H17.3577C18.3861 34.5952 19.2198 35.4287 19.2198 36.4568C19.2198 37.4849 18.3861 38.3183 17.3577 38.3183H17.3342C16.3058 38.3183 15.4722 37.4849 15.4722 36.4568ZM23.3405 36.4568C23.3405 35.4287 24.1742 34.5952 25.2026 34.5952H25.2262C26.2546 34.5952 27.0883 35.4287 27.0883 36.4568C27.0883 37.4849 26.2546 38.3183 25.2262 38.3183H25.2026C24.1742 38.3183 23.3405 37.4849 23.3405 36.4568ZM31.2092 36.4568C31.2092 35.4287 32.0428 34.5952 33.0712 34.5952H33.0946C34.123 34.5952 34.9567 35.4287 34.9567 36.4568C34.9567 37.4849 34.123 38.3183 33.0946 38.3183H33.0712C32.0428 38.3183 31.2092 37.4849 31.2092 36.4568Z" fill="${style.color}"/>
      </svg>
    `,
    vueComponent: AppVue.AppCalculator,
    objectClass: AppCalculator,
  },
  wnfa: {
    name: "wnfa",
    type: "internal",
    nameDisplay: "WNFA",
    description: "WNFA Poster generator",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M37.9062 37.8612H12.1491V12.0771H37.9062V37.8612ZM15.9034 34.23H34.3381V15.513H15.9034V34.23Z" fill="${style.color}"/>
        <path d="M37.9242 1H34.0437V8.83608H37.9242V1Z" fill="${style.color}"/>
        <path d="M15.8914 1H12.0109V8.95923H15.8914V1Z" fill="${style.color}"/>
        <path d="M37.8612 41.051H34.0437V48.824H37.8612V41.051Z" fill="${style.color}"/>
        <path d="M15.8914 41.051H12.0109V49.0103H15.8914V41.051Z" fill="${style.color}"/>
        <path d="M48.6828 34.0437H41.051V38.0294H48.6828V34.0437Z" fill="${style.color}"/>
        <path d="M8.57176 34.0437H1V37.8011H8.57176V34.0437Z" fill="${style.color}"/>
        <path d="M48.9982 12.011H41.051V15.8284H48.9982V12.011Z" fill="${style.color}"/>
        <path d="M8.82106 12.011H1V15.8854H8.82106V12.011Z" fill="${style.color}"/>
      </svg>
    `,
    vueComponent: AppVue.AppWnfa,
    objectClass: AppWnfa,
  },
  github: {
    name: "github",
    type: "external",
    nameDisplay: "GitHub",
    description: "Visit my GitHub homepage",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.5988 12.2257C42.5288 8.89323 41.1338 5.25073 41.0563 5.01823C40.8238 4.47573 40.2813 4.01073 39.6613 4.01073C39.5063 4.01073 35.9413 3.70073 32.3763 6.41323C29.5863 5.87073 26.4088 5.71573 26.2538 5.71573C26.1763 5.71573 26.1763 5.71573 26.0988 5.71573C25.9438 5.71573 22.7663 5.87073 19.9763 6.41323C16.4113 3.70073 12.8463 4.01073 12.6913 4.01073C12.0713 4.08823 11.5288 4.47573 11.2963 5.01823C11.2188 5.17323 9.74627 8.89323 10.7538 12.2257C8.97127 14.7057 7.57628 17.9607 8.81628 23.7732C9.97878 29.0432 14.3188 31.9882 18.8138 32.9957C18.4263 34.0807 18.2713 35.3982 18.1163 36.7932C16.2563 36.8707 15.0938 35.7857 13.4663 34.0807C12.0713 32.6082 10.5213 30.9032 7.96378 30.3607C7.11128 30.1282 6.25878 30.6707 6.02628 31.6007C5.87128 32.5307 6.41378 33.3832 7.34378 33.5382C8.81627 33.8482 9.82377 34.9332 11.0638 36.2507C12.6913 37.9557 14.5513 40.0482 17.8838 40.0482H17.9613C17.9613 41.8307 18.1163 43.5357 18.1938 44.9307C18.2713 45.8607 19.0463 46.4807 19.9763 46.4032C20.9063 46.3257 21.5263 45.5507 21.4488 44.6207C20.9838 39.3507 21.3713 33.7707 22.2238 32.9957C22.8438 32.6082 23.2313 31.9107 22.9988 31.1357C22.8438 30.4382 22.2238 29.8957 21.4488 29.8957C20.7513 29.8957 13.4663 29.5082 12.0713 23.0757C10.9088 17.8057 12.3813 15.4807 13.9313 13.6207C14.3188 13.1557 14.3963 12.4582 14.1638 11.8382C13.5438 10.5207 13.7763 8.66073 14.0863 7.42073C15.1713 7.57573 16.7988 8.04073 18.5038 9.51323C18.8913 9.90073 19.4338 9.97823 19.9763 9.90073C22.3788 9.28073 25.6338 9.12573 26.1763 9.12573C26.6413 9.12573 29.9738 9.28073 32.3763 9.90073C32.9188 10.0557 33.4613 9.90073 33.8488 9.51323C35.5538 8.04073 37.2588 7.57573 38.2663 7.42073C38.5763 8.58323 38.8088 10.4432 38.1888 11.8382C37.9563 12.3807 38.0338 13.0782 38.4213 13.6207C39.9713 15.4807 41.3663 17.8057 40.2813 23.0757C38.8863 29.5082 31.6013 29.8957 30.7488 29.9732C29.9738 29.9732 29.3538 30.5157 29.1988 31.2132C29.0438 31.9107 29.3538 32.6857 29.9738 33.0732C30.9038 33.8482 31.2913 39.3507 30.8263 44.6982C30.7488 45.6282 31.4463 46.4032 32.2988 46.4807C32.3763 46.4807 32.3763 46.4807 32.4538 46.4807C33.3063 46.4807 34.0038 45.8607 34.0813 45.0082C34.3913 41.5982 34.6238 36.3282 33.5388 32.9957C38.0338 32.0657 42.3738 29.0432 43.5363 23.7732C44.7763 17.9607 43.4588 14.7057 41.5988 12.2257Z" fill="${style.color}"/>
      </svg>
    `,
    objectClass: AppGithub,
  },
  linkedin: {
    name: "linkedin",
    type: "external",
    nameDisplay: "LinkedIn",
    description: "Go to my LinkedIn",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M24.4857 19.4457C26.3721 17.5182 28.8283 16.2571 31.6857 16.2571C34.6865 16.2571 37.5643 17.4492 39.6861 19.571C41.808 21.6929 43 24.5707 43 27.5714V43H38.8857V27.5714C38.8857 25.6619 38.1271 23.8305 36.7769 22.4803C35.4266 21.13 33.5953 20.3714 31.6857 20.3714C29.7762 20.3714 27.9448 21.13 26.5945 22.4803C25.2443 23.8305 24.4857 25.6619 24.4857 27.5714V43H20.3714V17.2857H24.4857V19.4457ZM10.0857 13.1714C9.26733 13.1714 8.48247 12.8463 7.90378 12.2676C7.3251 11.689 7 10.9041 7 10.0857C7 9.26733 7.3251 8.48247 7.90378 7.90378C8.48247 7.3251 9.26733 7 10.0857 7C10.9041 7 11.689 7.3251 12.2676 7.90378C12.8463 8.48247 13.1714 9.26733 13.1714 10.0857C13.1714 10.9041 12.8463 11.689 12.2676 12.2676C11.689 12.8463 10.9041 13.1714 10.0857 13.1714ZM8.02857 17.2857H12.1429V43H8.02857V17.2857Z" fill="${style.color}"/>
      </svg>
    `,
    objectClass: AppLinkedin,
  },
  menu: {
    name: "menu",
    type: "action",
    nameDisplay: "Menu",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.8333 9H9V15.8333H15.8333V9Z" fill="${style.color}"/>
        <path d="M15.8333 21.5278H9V28.3611H15.8333V21.5278Z" fill="${style.color}"/>
        <path d="M15.8333 34.0556H9V40.8889H15.8333V34.0556Z" fill="${style.color}"/>
        <path d="M28.3611 9H21.5278V15.8333H28.3611V9Z" fill="${style.color}"/>
        <path d="M28.3611 21.5278H21.5278V28.3611H28.3611V21.5278Z" fill="${style.color}"/>
        <path d="M28.3611 34.0556H21.5278V40.8889H28.3611V34.0556Z" fill="${style.color}"/>
        <path d="M40.8889 9H34.0556V15.8333H40.8889V9Z" fill="${style.color}"/>
        <path d="M40.8889 21.5278H34.0556V28.3611H40.8889V21.5278Z" fill="${style.color}"/>
        <path d="M40.8889 34.0556H34.0556V40.8889H40.8889V34.0556Z" fill="${style.color}"/>
      </svg>
    `,
  },
  reset: {
    name: "reset",
    type: "action",
    nameDisplay: "Reset",
    getAppIcon: (style) => /*html*/ `
      <svg height="${style.size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M25 6V9.22222C33.1468 9.22222 40.7778 16.8511 40.7778 25C40.7778 33.1489 33.1468 40.7778 25 40.7778C16.8532 40.7778 9.22222 33.1489 9.22222 25C9.22222 21.1008 10.7739 17.4295 13.4445 14.6935V18.7222H16.6667V9.11112H7.05555V12.3333H10.8365C7.75433 15.7787 6 20.269 6 25C6 35.4753 14.5225 44 25 44C35.4775 44 44 35.4753 44 25C44 14.5247 35.4775 6 25 6Z" fill="${style.color}"/>
      </svg>
    `,
  },
} as const;

// export
export default APPLICATION_INDEX;
export { applicationActionBar, applicationMenu };
