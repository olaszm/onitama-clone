import React, { useEffect, useState } from "react";

function useScrollProgress() {
	const [currentScrollPosition, setcurrentScrollPosition] = useState(0);
	const [isScrollable, setIsScrollable] = useState(false);

	const normalize = (val: number) => ((val - 0) * 100) / (1 - 0);

	useEffect(() => {
		const getIsScrollable = (ev: Event) => {
			const isScrollable =
				document.documentElement.scrollHeight >
				document.documentElement.clientHeight;
			setIsScrollable(isScrollable);
		};

		const getCurrentScrollHeight = (ev: Event) => {
			const winScroll =
				document.body.scrollTop || document.documentElement.scrollTop;

			const height =
				document.documentElement.scrollHeight -
				document.documentElement.clientHeight;

			const scrolled = winScroll / height;

			setcurrentScrollPosition(scrolled);
		};

		window.addEventListener("scroll", getCurrentScrollHeight);
		window.addEventListener("resize", getIsScrollable);

		return () => {
			window.removeEventListener("scroll", getCurrentScrollHeight);
			window.removeEventListener("resize", getIsScrollable);
		};
	}, []);

	return {
		scrollPosition: currentScrollPosition,
		scrollProgress: normalize(currentScrollPosition),
		isScrollable,
	};
}

export default useScrollProgress;
