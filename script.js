/* ==========================================================================
   RUSHI WAGH PORTFOLIO WIDGETS & LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initMobileMenu();
  initScrollEffects();
  initTerminalSimulation();
  initProjectFilters();
  initEksDiagram();
  initBlogSearch();
  initContactForm();
  updateFooterYear();
});

/* ==========================================================================
   1. BRANDED PRELOADER TERMINAL
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const output = document.getElementById('loader-output');
  if (!preloader || !output) return;

  const logs = [
    { text: "Initializing local portfolio agent bootloader...", type: "info" },
    { text: "Loading core system dependencies...", type: "info" },
    { text: "Checking tools: terraform (v1.8.4), kubectl (v1.29.2), aws-cli (v2.15.22)", type: "success" },
    { text: "Initiating connection to AWS Pune Region (ap-south-1)...", type: "info" },
    { text: "Scanning state: EKS cluster 'rushi-wagh-prod' is ACTIVE", type: "success" },
    { text: "AWS Cost Explorer: 28% optimization potential validated", type: "success" },
    { text: "All certificates, research papers, and keys loaded.", type: "success" },
    { text: "System boot COMPLETE. Launching developer portal...", type: "info" }
  ];

  let currentLog = 0;

  function printLog() {
    if (currentLog < logs.length) {
      const log = logs[currentLog];
      const p = document.createElement('p');
      if (log.type === "success") {
        p.innerHTML = `<span class="text-success">[OK]</span> ${log.text}`;
      } else {
        p.innerHTML = `<span class="text-accent">[INFO]</span> ${log.text}`;
      }
      output.appendChild(p);
      output.scrollTop = output.scrollHeight;
      currentLog++;
      setTimeout(printLog, 180 + Math.random() * 80);
    } else {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    }
  }

  // Start bootstrap log printing
  setTimeout(printLog, 200);
}

/* ==========================================================================
   2. THEME SWITCHING (PERSISTENT LIGHT / DARK MODE)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved preference or default to dark mode
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    
    showToast(`Switched to ${newTheme} mode`, 'success');
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. SCROLL PROGRESS, ACTIVE NAVBAR TRACKING, AND FADE ANIMATIONS
   ========================================================================== */
function initScrollEffects() {
  const scrollProgress = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('back-to-top');

  // Page Scroll Progress and Back-to-Top trigger
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (backToTop) {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active Navbar links highlighter using IntersectionObserver
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger near center-top of viewport
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // Fade-in/reveal animation on scroll
  const revealElements = document.querySelectorAll('.card, .section-header, .timeline-item');
  
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => {
    el.classList.add('reveal-hidden');
    revealObserver.observe(el);
  });

  // Skill Bars Width Filling on scroll
  const skillsSection = document.getElementById('skills');
  const skillFills = document.querySelectorAll('.skill-fill');

  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width;
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    skillsObserver.observe(skillsSection);
  }
}

/* ==========================================================================
   5. INTERACTIVE TERMINAL WIDGET (DEVOPS COMMAND LOOP)
   ========================================================================== */
function initTerminalSimulation() {
  const terminal = document.getElementById('hero-terminal');
  if (!terminal) return;

  const commands = [
    {
      input: "kubectl get pods -n production",
      output: `NAMESPACE    NAME                            READY  STATUS   RESTARTS  AGE
production   eks-rushi-api-7c4fd9bb-a12b     1/1    Running  0         42d
production   eks-rushi-web-96f7c8d9-f56g     1/1    Running  0         42d
production   db-postgres-master-0            1/1    Running  0         180d
production   monitoring-prometheus-0         2/2    Running  0         90d`
    },
    {
      input: "terraform plan",
      output: `Terraform will perform the following actions:
  ~ module.security_groups.aws_security_group.ingress
      ~ description = "Allow load balancer traffic" -> "Secure load balancer entry"
  + module.vpc.aws_subnet.public_subnet_c
      cidr_block = "10.0.3.0/24"
      
Plan: 1 to add, 1 to change, 0 to destroy.`
    },
    {
      input: "aws s3 ls --human-readable",
      output: `2024-03-12 08:24:11   0 Bytes   rushi-wagh-tf-state
2024-05-18 14:15:30   2.4 GiB   rushi-wagh-velero-backups
2026-06-01 10:05:02  15.1 MiB   rushi-wagh-cost-reports-2026`
    }
  ];

  let currentCmdIdx = 0;

  function runSequence() {
    const data = commands[currentCmdIdx];
    const promptLine = document.createElement('p');
    promptLine.innerHTML = `<span class="text-success">rushi@aws-console</span>:<span class="text-accent">~</span>$ `;
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'text-primary';
    promptLine.appendChild(cmdSpan);
    terminal.appendChild(promptLine);

    let charIdx = 0;
    const typedText = data.input;

    function typeCharacter() {
      if (charIdx < typedText.length) {
        cmdSpan.textContent += typedText.charAt(charIdx);
        charIdx++;
        terminal.scrollTop = terminal.scrollHeight;
        setTimeout(typeCharacter, 40 + Math.random() * 30);
      } else {
        // Commmand finished typing, print output after small delay
        setTimeout(() => {
          const outPre = document.createElement('pre');
          outPre.style.color = '#cbd5e1';
          outPre.style.margin = '0.5rem 0 1rem';
          outPre.style.lineHeight = '1.4';
          outPre.style.whiteSpace = 'pre-wrap';
          outPre.style.fontFamily = 'var(--font-mono)';
          outPre.textContent = data.output;
          terminal.appendChild(outPre);
          terminal.scrollTop = terminal.scrollHeight;

          // Move to next command after reading time
          setTimeout(() => {
            // Clear console if terminal is getting too full
            if (terminal.children.length > 5) {
              terminal.innerHTML = '';
            }
            currentCmdIdx = (currentCmdIdx + 1) % commands.length;
            runSequence();
          }, 4000);

        }, 300);
      }
    }

    setTimeout(typeCharacter, 500);
  }

  // Start sequence
  runSequence();
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('[data-category]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE EKS ARCHITECTURE SVG DIAGRAM
   ========================================================================== */
function initEksDiagram() {
  const svgNodes = document.querySelectorAll('#eks-svg-diagram .dia-node');
  const infoPanel = document.getElementById('diagram-info-text');

  if (svgNodes.length === 0 || !infoPanel) return;

  svgNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const infoText = node.getAttribute('data-info') || 'Interactive deployment component';
      infoPanel.style.opacity = '0';
      
      setTimeout(() => {
        infoPanel.textContent = infoText;
        infoPanel.style.opacity = '1';
        infoPanel.style.borderColor = 'var(--accent)';
      }, 100);
    });

    node.addEventListener('mouseleave', () => {
      infoPanel.style.opacity = '0';
      
      setTimeout(() => {
        infoPanel.textContent = "Hover over the diagram components above to check configuration configurations and details!";
        infoPanel.style.opacity = '1';
        infoPanel.style.borderColor = 'var(--border)';
      }, 100);
    });
  });
}

/* ==========================================================================
   8. BLOG SEARCH ENGINE
   ========================================================================== */
function initBlogSearch() {
  const searchInput = document.getElementById('blog-search');
  const blogCards = document.querySelectorAll('.blog-card');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    blogCards.forEach(card => {
      const titleSearchText = card.getAttribute('data-title') || '';
      const contentText = card.textContent.toLowerCase();

      if (titleSearchText.includes(query) || contentText.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   9. CONTACT FORM INTERACTIVE HANDLER WITH TOASTS (FETCH)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  // TO DO: Replace this with your actual Lambda Function URL after deployment
  const LAMBDA_URL = "YOUR_LAMBDA_FUNCTION_URL_HERE";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const service = document.getElementById('form-service').value.trim();
    const budget = document.getElementById('form-budget') ? document.getElementById('form-budget').value : '';
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !service || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const payload = {
      name: name,
      email: email,
      service: service,
      budget: budget,
      message: message
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="pulse-dot"></span> Sending Request...';
    
    // Fallback if URL is not configured
    if (LAMBDA_URL === "YOUR_LAMBDA_FUNCTION_URL_HERE") {
      setTimeout(() => {
        showToast("Lambda URL not configured yet. Form simulation successful.", "success");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
      return;
    }

    try {
      const response = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      const jsonResponse = await response.json();
      
      if (response.ok && jsonResponse.success) {
        showToast(jsonResponse.message || `Thanks ${name}! Your consultation request has been received.`, "success");
        form.reset();
      } else {
        showToast(jsonResponse.message || "Something went wrong. Please try again.", "error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showToast("Network error. Could not submit request.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Automatically remove toast from DOM after animations complete
  setTimeout(() => {
    toast.remove();
  }, 4500);
}

/* ==========================================================================
   11. AUTOMATED FOOTER YEAR SETTING
   ========================================================================== */
function updateFooterYear() {
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
