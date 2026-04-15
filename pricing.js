// Dodaj style tag dinamički kroz JS
const style = document.createElement("style");
style.id = "ab-test-hide";
style.textContent = "body { visibility: hidden; }";
document.head.appendChild(style);

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

  console.log("Variant:", variant);
})();
