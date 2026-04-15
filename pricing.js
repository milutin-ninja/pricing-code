/**
   * Redirects users to the correct pricing page based on the "feat_grow_plan_enabled" experiment.
   * "Treatment" → /plans, "Control" or "Exclude" → /pricing.
   */
  function showPage() {
    const style = document.getElementById("ab-test-hide");
    if (style) style.remove();
  }

  (async function redirectByExperiment() {
    if (localStorage.getItem("ab_test_page_assigned")) {
      showPage();
      return;
    }
    localStorage.setItem("ab_test_page_assigned", "true");

    const { hostname } = window.location;
    const isStaging =
      hostname === "stg.riverside.com" || hostname === "stg.riverside.fm";
    const apiBase = isStaging
      ? "https://stg.riverside.fm"
      : "https://riverside.fm";

    const response = await fetch(
      `${apiBase}/feature-flags-service/experiments/feat_grow_plan_enabled`,
      { credentials: "include" }
    );
    const { variant } = await response.json();

    /*
    if (variant !== "Exclude" && typeof analytics !== "undefined") {
      analytics.track("_eppoExperimentAssignment", {
        experiment: "featGrowPlanEnabled",
        variation: variant,
      });
    }
    */

    console.log("Variant:", variant);
    showPage();
    // const path = variant === "Treatment" ? "/lp/dev-plans" : "/lp/dev-pricing";
    // window.location.href = `${window.location.origin}${path}`;
  })();
