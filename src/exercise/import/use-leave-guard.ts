import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { confirmAction } from "../../exports";

/** What the leave dialog says: the template confirm's title, description and labels. */
export type LeaveConfirm = Parameters<typeof confirmAction>[0];

/**
 * While `active`, ask before the page is left: a reload or a closed tab gets
 * the browser's own prompt (the only one a page may show there), and a click
 * on an in-app link (the sidebar, a header link) is held while the suite's
 * confirm dialog asks, then followed on a yes. The app uses a plain
 * BrowserRouter, which has no navigation blocker, so links are caught in the
 * capture phase before the router sees them.
 */
export function useLeaveGuard(active: boolean, confirm: LeaveConfirm): void {
  const navigate = useNavigate();
  const confirmRef = useRef(confirm);
  confirmRef.current = confirm;

  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Older browsers show the prompt only when this is set.
      event.returnValue = "";
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      // Another site is left through beforeunload; the same page is no leave.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      // The dialog answers later, so the click is always held and replayed as a navigation on a yes.
      event.preventDefault();
      event.stopPropagation();
      void confirmAction(confirmRef.current).then((leave) => {
        if (leave) navigate(`${url.pathname}${url.search}${url.hash}`);
      });
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [active, navigate]);
}
