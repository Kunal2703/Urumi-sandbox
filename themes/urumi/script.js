document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("mobile-menu"),
        openBtn = document.getElementById("menu-open-icon"),
        closeBtns = document.querySelectorAll(".mobile-menu-close"),
        scrollTopBtn = document.querySelector(".scroll-top-div"),
        header = document.querySelector(".header-main-div");

  openBtn.onclick = () => {
    menu.style.display = "block";
    setTimeout(() => menu.classList.add("active"), 10);
  };

  closeBtns.forEach(btn => btn.onclick = () => {
    menu.classList.remove("active");
    setTimeout(() => menu.style.display = "none", 400);
  });

 document.querySelectorAll(".details-div summary").forEach(summary => {
  summary.onclick = e => {
    e.preventDefault();
    const details = summary.parentElement;

    // First, close all other open details blocks
    document.querySelectorAll(".details-div").forEach(otherDetails => {
      if (otherDetails !== details && otherDetails.hasAttribute("open")) {
        const otherContent = otherDetails.querySelector(".details-content");
        otherContent.style.maxHeight = "0";
        setTimeout(() => otherDetails.removeAttribute("open"), 300);
      }
    });

    // Then, toggle the clicked details block
    const content = details.querySelector(".details-content");
    if (details.hasAttribute("open")) {
      content.style.maxHeight = "0";
      setTimeout(() => details.removeAttribute("open"), 300);
    } else {
      details.setAttribute("open", "");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  };
});
	
  scrollTopBtn.style.display = "none";

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    scrollTopBtn.style.display = y > 300 ? "block" : "none";
    header.classList.toggle("is-sticky", y > 100);
  });

  scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
});
