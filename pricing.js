/**
   * Redirects users to the correct pricing page based on the "feat_grow_plan_enabled" experiment.
   * "Treatment" → /plans, "Control" or "Exclude" → /pricing.
   */
  function showPage() {
    const style = document.getElementById("ab-test-hide");
    if (style) style.remove();
  }

  function waitForAnonymousId() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof window.analytics !== "undefined" && window.analytics.user && window.analytics.user().id()) {
          clearInterval(checkInterval);
          resolve(window.analytics.user().id());
        }
      }, 50);

      // Timeout nakon 10 sekundi da ne čeka zauvijek
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(null);
      }, 10000);
    });
  }

  (async function redirectByExperiment() {
    console.log("Running A/B test redirection script");
    
    // Čekaj da se postavi ajs_anonymous_id
    const anonymousId = await waitForAnonymousId();
    console.log("Anonymous ID:", anonymousId);

    const cachedVariant = localStorage.getItem("ab_test_variant");
    if (cachedVariant) {
      console.log("Variant (cached):", cachedVariant);
      showPage();
      // const path = cachedVariant === "Treatment" ? "/lp/dev-plans" : "/lp/dev-pricing";
      // window.location.href = `${window.location.origin}${path}`;
      return;
    }
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
    localStorage.setItem("ab_test_variant", variant);
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
