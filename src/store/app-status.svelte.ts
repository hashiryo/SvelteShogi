export type AppStatus = "LOADING" | "UNAUTHENTICATED" | "AUTHENTICATED" | "PASSWORD_RESET";

let status = $state<AppStatus>("LOADING");

export const AppStatusStore = {
  get: () => status,
  set: (newStatus: AppStatus) => {
    status = newStatus;
  },
};
