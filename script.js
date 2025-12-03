// 1. Define global function for HTML onkeydown attribute
window.formatPhoneOnEnter = function (element, event) {
  let allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter"];
  if (allowedKeys.includes(event.key)) return;

  if (!/^[0-9]$/.test(event.key) && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    return;
  }

  setTimeout(() => {
    let input = element.value;

    input = input.replace(/\D/g, "");
    input = input.substring(0, 10);
    let size = input.length;
    if (size === 0) {
      element.value = input;
    } else if (size < 4) {
      element.value = "(" + input;
    } else if (size < 7) {
      element.value =
        "(" + input.substring(0, 3) + ") " + input.substring(3, 6);
    } else {
      element.value =
        "(" +
        input.substring(0, 3) +
        ") " +
        input.substring(3, 6) +
        "-" +
        input.substring(6, 10);
    }
  }, 0);
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("webToCaseForm");

  // Reset form on load to ensure clean state
  if (form) form.reset();

  // --- IDs from your HTML ---
  const categorySelectId = "00NWC000004WAk9";
  const typeSelectId = "00NWC000004WAkB";
  const emailInputId = "00NWC000004WAjt";
  const phoneInputId = "00NWC000004WAk0";

  // --- Element Selectors ---
  const categorySelect = document.getElementById(categorySelectId);
  const typeSelect = document.getElementById(typeSelectId);
  const emailInput = document.getElementById(emailInputId);
  const phoneInput = document.getElementById(phoneInputId);

  // NEW: Select the submit button
  const submitButton = form ? form.querySelector(".submit-btn") : null;

  // --- 1. Multi-Select UX Logic ---
  if (categorySelect) {
    categorySelect.addEventListener("mousedown", function (e) {
      e.preventDefault();
      const option = e.target;
      if (option.tagName === "OPTION") {
        option.selected = !option.selected;
        categorySelect.dispatchEvent(new Event("change"));
      }
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener("mousedown", function (e) {
      e.preventDefault();
      const option = e.target;
      if (option.tagName === "OPTION") {
        option.selected = !option.selected;
        typeSelect.dispatchEvent(new Event("change"));
      }
    });
  }

  // --- 2. Remove Error Styles on Input ---
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      this.classList.remove("error-input");
    });
  }
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.classList.remove("error-input");
    });
  }

  // --- 3. Dynamic Service Options Data ---
  const serviceOptions = {
    "Bearing Repack": [
      { val: "Tandem Axle", text: "Tandem Axle" },
      { val: "Triple Axle", text: "Triple Axle" },
    ],
    "Suspension Upgrade": [
      { val: "Roadmaster Comfort Ride", text: "Roadmaster Comfort Ride" },
      {
        val: "Lippert Center-Point Air Ride System",
        text: "Lippert Center-Point Air Ride",
      },
      { val: "CRE 3000 (MORryde)", text: "CRE 3000 (MORryde)" },
      { val: "AllTrek 4000 (MORryde)", text: "AllTrek 4000 (MORryde)" },
      {
        val: "Heavy Duty Shackle and Wet Bolt Kit (MORryde)",
        text: "Heavy Duty Shackle & Wet Bolt Kit",
      },
      { val: "Crossmember (MORryde)", text: "Crossmember (MORryde)" },
      { val: "Unsure", text: "Unsure / Need Advice" },
    ],
    "Disc Brake Upgrade": [
      { val: "DeeMaxx", text: "DeeMaxx" },
      { val: "Kodiak", text: "Kodiak" },
      { val: "Disc Brake Upgrade - Unsure", text: "Unsure / Need Advice" },
    ],
    "Additional Safety Products": [
      { val: "Hubsavers", text: "Hubsavers" },
      { val: "Solid Steel Lugnuts", text: "Solid Steel Lugnuts" },
    ],
  };

  // --- 4. Service Type Dependency Logic ---
  if (categorySelect && typeSelect) {
    categorySelect.addEventListener("change", function () {
      updateServiceTypes(categorySelect, typeSelect, serviceOptions);
    });
  }

  function updateServiceTypes(catSelect, typSelect, optionsMap) {
    const selectedOptions = Array.from(catSelect.selectedOptions);
    const prevSelected = new Set(
      Array.from(typSelect.selectedOptions).map((opt) => opt.value)
    );

    typSelect.innerHTML = "";
    let hasValidSelections = false;

    if (selectedOptions.length > 0) {
      selectedOptions.forEach((option) => {
        const categoryName = option.value;
        if (optionsMap[categoryName]) {
          hasValidSelections = true;
          const group = document.createElement("optgroup");
          group.label = categoryName;

          optionsMap[categoryName].forEach((opt) => {
            const newOption = document.createElement("option");
            newOption.value = opt.val;
            newOption.text = opt.text;
            if (prevSelected.has(opt.val)) newOption.selected = true;
            group.appendChild(newOption);
          });
          typSelect.appendChild(group);
        }
      });
    }

    if (hasValidSelections) {
      typSelect.disabled = false;
    } else {
      typSelect.disabled = true;
      const defaultOption = document.createElement("option");
      defaultOption.text =
        selectedOptions.length === 0
          ? "-- Select Categories First --"
          : "No subtypes for selection";
      typSelect.appendChild(defaultOption);
    }
  }

  // --- 5. Toast Notification Function ---
  function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = message;

    // Reset classes and set type
    toast.className = "toast show";
    if (isError) {
      toast.classList.add("error");
    } else {
      toast.classList.add("success");
    }

    setTimeout(() => {
      toast.classList.remove("show", "success", "error");
    }, 5000);
  }

  // --- 6. Handle Iframe Load (Completion) ---
  const iframe = document.getElementById("hidden_iframe");
  let isSubmitting = false;

  if (iframe) {
    iframe.addEventListener("load", function () {
      if (isSubmitting) {
        showToast("Case submitted successfully!", false);

        form.reset();

        if (typeSelect) {
          typeSelect.innerHTML =
            '<option value="">-- Select Categories First --</option>';
          typeSelect.disabled = true;
        }

        // --- RE-ENABLE BUTTON ---
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.value = "submit"; // Restore original text
        }

        isSubmitting = false;
      }
    });
  }

  // --- 7. Main Submit Handler ---
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValidInfo = true;
      let errorMessages = [];

      // ============================================
      // STEP 1: TRIM VALUES
      // ============================================
      if (emailInput) emailInput.value = emailInput.value.trim();
      if (phoneInput) phoneInput.value = phoneInput.value.trim();

      // ============================================
      // STEP 2: PERFORM VALIDATION
      // ============================================

      // Email Validation
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          emailInput.classList.add("error-input");
          isValidInfo = false;
          errorMessages.push("Invalid Email Address format.");
        } else {
          emailInput.classList.remove("error-input");
        }
      }

      // Phone Validation
      if (phoneInput) {
        const phoneRegex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(phoneInput.value)) {
          phoneInput.classList.add("error-input");
          isValidInfo = false;
          errorMessages.push("Invalid Phone Number (min 10 digits required).");
        } else {
          phoneInput.classList.remove("error-input");
        }
      }

      // Stop if Basic Errors
      if (!isValidInfo) {
        showToast("Please fix the errors:\n" + errorMessages.join("\n"), true);
        return;
      }

      // Validate Service Categories
      const selectedCategories = Array.from(categorySelect.selectedOptions).map(
        (o) => o.value
      );
      const selectedTypes = Array.from(typeSelect.selectedOptions).map(
        (o) => o.value
      );

      for (const cat of selectedCategories) {
        const typesForCat = serviceOptions[cat];
        if (typesForCat && typesForCat.length > 0) {
          const hasType = typesForCat.some((t) =>
            selectedTypes.includes(t.val)
          );
          if (!hasType) {
            showToast(
              `Please select at least one Service Type for "${cat}".`,
              true
            );
            return;
          }
        }
      }

      // ============================================
      // STEP 3: LOCK & SUBMIT
      // ============================================

      // 1. Disable Button Immediately
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.value = "Submitting..."; // Give visual feedback
      }

      // 2. Set Flag
      isSubmitting = true;

      // 3. Submit
      HTMLFormElement.prototype.submit.call(form);
    });
  }
});
