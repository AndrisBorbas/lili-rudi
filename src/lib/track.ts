import { useEffect } from "react";
import * as Swetrix from "swetrix";

export const TRACKING_ID = "E0UJhqbJEXUU";

export function useSwetrix(
	pid: string = TRACKING_ID,
	initOptions: Swetrix.LibOptions = {
		apiURL: "https://succ.andrisborbas.com/log",
	},
	pageViewsOptions: Swetrix.PageViewsOptions = {},
	errorOptions: Swetrix.ErrorOptions = {},
) {
	useEffect(() => {
		Swetrix.init(pid, initOptions);
		void Swetrix.trackViews(pageViewsOptions);
		void Swetrix.trackErrors(errorOptions);
	}, [errorOptions, initOptions, pageViewsOptions, pid]);
}
