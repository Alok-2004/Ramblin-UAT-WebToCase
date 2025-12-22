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

const rvYearSelect = document.getElementById("00NWC000004WAk6");
const rvMakeSelect = document.getElementById("00NWC000004WAk3");
const prefferedContact = document.getElementById("00NWC000004WAk1");
const Axletype = document.getElementById("00NWC000004WAjo");
const state = document.getElementById("00NWC000004jHFJ");

function setSectionFieldsValue(section, value) {
  if (!section) return;

  const fields = section.querySelectorAll(
    'input[type="text"], input[type="hidden"], textarea, select'
  );

  fields.forEach(field => {
    field.value = value;
  });
}

function clearSectionFields(section) {
  if (!section) return;

  const fields = section.querySelectorAll(
    'input[type="text"], input[type="hidden"], textarea, select'
  );

  fields.forEach(field => {
    field.value = "";
  });
}

function toggleRequired(section, isRequired) {
  if (!section) return;

  const fields = section.querySelectorAll(
    'input, textarea, select'
  );

  fields.forEach(field => {
    if (isRequired) {
      field.setAttribute("required", "required");
    } else {
      field.removeAttribute("required");
    }
  });
}


function setupNoBlinkDropdown(selectElement) {
  if (!selectElement) return;

  let isExpanded = false;

  const expand = (el) => {
    const totalOptions = el.options.length;
    el.size = totalOptions > 4 ? 4 : totalOptions;
    isExpanded = true;
    el.classList.add("is-expanded");
    el.focus();
  };

  const collapse = () => {
    selectElement.size = 1;
    isExpanded = false;
    selectElement.classList.remove("is-expanded");
  };

  selectElement.addEventListener(
    "mousedown",
    function (e) {
      if (isExpanded) return;
      e.preventDefault();
      e.stopPropagation();
      expand(this);
    },
    true
  );

  selectElement.addEventListener("change", collapse);
  selectElement.addEventListener("blur", collapse);

  selectElement.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      if (!isExpanded) {
        e.preventDefault();
        expand(this);
      }
    } else if (e.key === "Escape") {
      collapse();
      this.blur();
    }
  });
}

setupNoBlinkDropdown(rvYearSelect);
setupNoBlinkDropdown(rvMakeSelect);
setupNoBlinkDropdown(prefferedContact);
setupNoBlinkDropdown(Axletype);
setupNoBlinkDropdown(state);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("webToCaseForm");

  const rallySection = document.querySelector(".RallyInfo");
  const installAddressSection = document.querySelector(".InstallAddress");
  const rallyNameInput = document.getElementById("00NWC000004WAjz");
  const rallyRadios = document.querySelectorAll('input[name="attendRally"]');

  const arrivalInput = document.getElementById("00NWC000004WAjq");
  const departureInput = document.getElementById("00NWC000004WAjr");
  const customerUnavailablity = document.getElementById("00NWC000004WAjs");
  const rvSiteNumber=document.getElementById("00NWC000004WAk5");
  const streetInput = document.getElementById("00NWC000004iEhi");
  const stateSelect = document.getElementById("00NWC000004jHFJ");
  const postalcode = document.getElementById("00NWC000004iEwE");
  const cityInput = document.getElementById("00NWC000004iFlp");

  let datePickers = null;

  if (typeof flatpickr !== "undefined") {
    datePickers = flatpickr(".custom-datepicker", {
      dateFormat: "m/d/Y", // Fix for Salesforce US Locale
      altInput: true,
      altFormat: "F j, Y",
      minDate: "today",
      disableMobile: true,
      onReady: function (selectedDates, dateStr, fp) {
        fp.calendarContainer.addEventListener(
          "mousedown",
          function (e) {
            const day = e.target.closest(".flatpickr-day");
            if (!day || day.classList.contains("disabled")) return;
            if (fp.selectedDates.length === 1) {
              const clicked = day.dateObj.getTime();
              const selected = fp.selectedDates[0].getTime();
              if (clicked === selected) {
                e.preventDefault();
                e.stopImmediatePropagation();
                fp.clear();
              }
            }
          },
          true
        );
      },
    });
  }

  function fullFormReset() {
    form.reset();

    if (rallySection) {
      rallySection.style.display = "none";
    }

    if (installAddressSection) {
      installAddressSection.style.display = "none";
    }

    if (datePickers) {
      const instances = Array.isArray(datePickers)
        ? datePickers
        : [datePickers];
      instances.forEach((fp) => fp.clear());
    }
  }

 rallyRadios.forEach((radio) => {
  radio.addEventListener("change", function () {

    if (this.value === "yes") {
      rallySection.style.display = "block";
      installAddressSection.style.display = "none";

      rallyNameInput.setAttribute("required", "required");
      streetInput.removeAttribute("required");
      stateSelect.removeAttribute("required");
      postalcode.removeAttribute("required");
      cityInput.removeAttribute("required");

      streetInput.value="",
      stateSelect.value="",
      postalcode.value="",
      cityInput.value=""
      

    } else if (this.value === "no") {
      rallySection.style.display = "none";
      installAddressSection.style.display = "block";

      rallyNameInput.removeAttribute("required");
      streetInput.setAttribute("required", "required");
      stateSelect.setAttribute("required", "required");
      postalcode.setAttribute("required", "required");
      cityInput.setAttribute("required", "required");


      
      rallyNameInput.value = "";
      arrivalInput.value = "";
      departureInput.value = "";
      rvSiteNumber="";
      customerUnavailablity="";

      if (datePickers) {
        const instances = Array.isArray(datePickers)
          ? datePickers
          : [datePickers];

        instances.forEach((fp) => fp.clear());
      }
    }
  });
});


  if (form) {
    form.reset();
  }

  const categorySelectId = "00NWC000004WAk9";
  const typeSelectId = "00NWC000004WAkB";
  const emailInputId = "00NWC000004WAjt";
  const phoneInputId = "00NWC000004WAk0";

  const categorySelect = document.getElementById(categorySelectId);
  const typeSelect = document.getElementById(typeSelectId);
  const emailInput = document.getElementById(emailInputId);
  const phoneInput = document.getElementById(phoneInputId);
  const postalCodeInput = document.getElementById("00NWC000004iEwE");

  const submitButton = form ? form.querySelector(".submit-btn") : null;

  const charLimits = {
    "00NWC000004WAjw": 255, // First Name
    "00NWC000004WAjy": 255, // Last Name
    "00NWC000004WAjt": 255, // Email
    "00NWC000004WAk0": 15, // Phone
    "00NWC000004WAkC": 255, // Spouse Name
    "00NWC000004WAk4": 255, // RV Model
    description: 32000, // Description
  };

  function checkCharacterLimit(element) {
    const limit = charLimits[element.name] || charLimits[element.id];
    if (limit && element.value.length > limit) {
      return `The input for '${
        element.labels
          ? element.labels[0].textContent.replace("*", "").trim()
          : element.name
      }' is too long. Max allowed is ${limit} characters.`;
    }
    return null;
  }

  function getFieldLabel(field) {
  if (field.labels && field.labels.length > 0 && field.labels[0]) {
    return field.labels[0].textContent.replace("*", "").trim();
  }
  return field.getAttribute("placeholder") || field.name || "This field";
}

const allRequiredFields = form.querySelectorAll(
  'input[required], textarea[required], select[required]'
);

allRequiredFields.forEach((field) => {
  field.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      this.classList.remove("error-input");
    }
  });

  field.addEventListener("change", function () {
    if (this.value.trim() !== "") {
      this.classList.remove("error-input");
    }
  });
});



  function makeMultiSelect(selectElement) {
    if (!selectElement) return;

    selectElement.multiple = true;

    selectElement.addEventListener("mousedown", function (e) {
      if (e.target.tagName !== "OPTION") return;

      e.preventDefault();

      const option = e.target;
      const scrollTop = this.scrollTop;

      option.selected = !option.selected;

      this.dispatchEvent(new Event("change"));

      this.focus();
      setTimeout(() => {
        this.scrollTop = scrollTop;
      }, 0);
    });
  }

  if (categorySelect) makeMultiSelect(categorySelect);
  if (typeSelect) makeMultiSelect(typeSelect);

  if(rallyNameInput){
    rallyNameInput.addEventListener("input",function(){
      this.classList.remove("error-input");
    });
  }
  
  if(streetInput){
    streetInput.addEventListener("input",function(){
      this.classList.remove("error-input");  
    });
  }
  if(cityInput){
    cityInput.addEventListener("input",function(){
      this.classList.remove("error-input");  
    });
    
  }
    if(postalCodeInput){
    postalCodeInput.addEventListener("input",function(){
      this.classList.remove("error-input");  
    });
    
  }
  

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

  function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = message;

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

  const iframe = document.getElementById("hidden_iframe");
  let isSubmitting = false;

  if (iframe) {
    iframe.addEventListener("load", function () {
      if (isSubmitting) {
        showToast("Case submitted successfully!", false);

        if (datePickers) {
          const instances = Array.isArray(datePickers)
            ? datePickers
            : [datePickers];
          instances.forEach((fp) => fp.clear());
        }

        form.reset();

        if (rallySection) {
          rallySection.style.display = "none";
        }

        if (installAddressSection) {
          installAddressSection.style.display = "none";
        }

        if (typeSelect) {
          typeSelect.innerHTML =
            '<option value="">-- Select Categories First --</option>';
          typeSelect.disabled = true;
        }

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.value = "Submit";
        }

        isSubmitting = false;
      }
    });
  }

  fullFormReset();

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValidInfo = true;
      let errorMessages = [];
      let errorElements = [];
      const formFields = form.querySelectorAll(
        'input[type="text"], input[type="email"], textarea'
      );

      formFields.forEach((field) => {
        field.value = field.value.trim();
        field.classList.remove("error-input");

        // Edge case Fix
        if (field.hasAttribute("required") && field.value === "") {
          console.log('this is required field');
          isValidInfo = false;
          errorElements.push(field);

          const label = getFieldLabel(field);
          errorMessages.push(`'${label}'`);
          return;
        }
      });

      formFields.forEach((field) => {
        const charError = checkCharacterLimit(field);
        if (charError) {
          errorElements.push(field);
          errorMessages.push(charError);
          isValidInfo = false;
        }
      });

      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          errorElements.push(emailInput);
          isValidInfo = false;
          errorMessages.push("Invalid Email Address format.");
        }
      }

      if (postalCodeInput && postalCodeInput.offsetParent !== null) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (
          postalCodeInput.value !== "" &&
          !zipRegex.test(postalCodeInput.value)
        ) {
          isValidInfo = false;
          errorElements.push(postalCodeInput);
          errorMessages.push(
            "Invalid Postal Code format. Please follow the given format (12345 or 12345-6789)."
          );
        }
      }

      if (phoneInput) {
        const phoneRegex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(phoneInput.value)) {
          errorElements.push(phoneInput);
          isValidInfo = false;
          errorMessages.push("Invalid Phone Number (min 10 digits required).");
        }
      }

      const arrivalInput = document.getElementById("00NWC000004WAjq");
      const departureInput = document.getElementById("00NWC000004WAjr");
      if (
        arrivalInput &&
        departureInput &&
        arrivalInput.value &&
        departureInput.value
      ) {
        const arrivalDate = new Date(arrivalInput.value);
        const departureDate = new Date(departureInput.value);

        if (arrivalDate > departureDate) {
          isValidInfo = false;
          errorElements.push(arrivalInput, departureInput);
          errorMessages.push(
            "Arrival Date cannot be after the Departure Date."
          );
        }
      }

      errorElements.forEach((element) => element.classList.add("error-input"));

      if (!isValidInfo) {
        showToast("Please fix the errors:\n" + errorMessages.join("\n"), true);
        return;
      }

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
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.value = "Submitting...";
      }

      isSubmitting = true;

      HTMLFormElement.prototype.submit.call(form);
    });
  }
});
