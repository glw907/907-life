---
title: "Contact"
date: 2025-10-25
type: page
menu:
  main:
    weight: 6
---

The following people contribute to 907.life, sharing their experiences and insights about living without smartphones:

### Geoff Wright

I'm a husband and father of three living in Anchorage, Alaska, and the primary author of this site. I love snow, cross country skiing, biking, sailing, trails, books, general nerdery, trees, kindness, and Sunday morning pancakes. I was born in Iowa, and I've also lived in Nebraska, Massachusetts, and Maryland. I graduated with from [St. Mary's College of Maryland](https://www.smcm.edu) with a BA in Philosophy.

I owned [Pango Technology, Inc.](https://www.pangotechnology.com), a software development firm, until 2023 when I sold my shares to my partners and partially retired. These days I dedicate my time to doing good in my community: working as a small business counselor with the [Alaska Small Business Development Center](https://aksbdc.org), coaching cross country skiing at [Bettye Davis East High School](https://east.asdk12.org), and volunteering as a sailing instructor at the [Alaska Sailing Club](https://aksailingclub.org).

I haven't used a smartphone in three years.

### [Author Name 2]

[Bio paragraph]

---

## Get in Touch

If you'd like to contact us, use the form below:

<form action="https://api.web3forms.com/submit" method="POST" id="contact-form" novalidate>

<input type="hidden" name="access_key" value="66a4d192-fa4d-49ac-8cc2-a0806cd581b0">
<input type="hidden" name="replyto" id="replyto">
<input type="hidden" name="subject" id="subject-hidden">
<input type="hidden" name="from_name" id="from-name-hidden">
<input type="checkbox" name="botcheck" style="display: none;">

<div class="form-row">
<p>
<label for="name">Name</label><br>
<input type="text" id="name" required aria-describedby="name-error">
<span id="name-error" class="error-message" role="alert"></span>
</p>

<p>
<label for="email">Email</label><br>
<input type="email" id="email" required pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}" placeholder="you@example.com" aria-describedby="email-error">
<span id="email-error" class="error-message" role="alert"></span>
</p>
</div>

<p>
<label for="subject">Subject</label><br>
<input type="text" id="subject" required aria-describedby="subject-error">
<span id="subject-error" class="error-message" role="alert"></span>
</p>

<p>
<label for="message">Message</label><br>
<textarea name="message" id="message" rows="6" required aria-describedby="message-error"></textarea>
<span id="message-error" class="error-message" role="alert"></span>
</p>

<p>
<button type="submit" id="submit-btn">Send Message</button>
</p>

<div id="form-result" role="status" aria-live="polite"></div>

</form>

<style>
#contact-form label {
  font-variant: small-caps;
  font-weight: 600;
}

#contact-form p {
  margin: 0 0 0.5em 0;
}

#contact-form input[type="text"],
#contact-form input[type="email"],
#contact-form textarea {
  width: 100%;
  max-width: 40em;
  padding: 0.5em;
  font-family: inherit;
  font-size: inherit;
  border: 1px solid var(--accent2);
  border-radius: 3px;
  background: var(--background);
  color: var(--text);
  box-sizing: border-box;
  transition: border-color 0.2s;
}

#contact-form input.invalid,
#contact-form textarea.invalid {
  border-color: var(--alert-border);
}

#contact-form .error-message {
  display: block;
  color: var(--alert-border);
  font-size: 0.9em;
  margin-top: 0.25em;
  min-height: 1.2em;
}

#contact-form textarea {
  resize: vertical;
}

#contact-form input:focus,
#contact-form textarea:focus {
  outline: 2px solid var(--link);
  outline-offset: 2px;
}

#contact-form button {
  background: var(--link);
  color: var(--button-text);
  border: none;
  padding: 0.5em 1.5em;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  border-radius: 3px;
  transition: opacity 0.2s;
}

#contact-form button:hover:not(:disabled) {
  opacity: 0.9;
}

#contact-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

#form-result {
  padding: 1em;
  margin-top: 1em;
  border-radius: 3px;
  position: relative;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.3s ease, max-height 0.3s ease, margin-top 0.3s ease, padding 0.3s ease;
}

#form-result.visible {
  opacity: 1;
  max-height: 200px;
  margin-top: 1em;
}

#form-result.success {
  background: var(--note);
  border: 2px solid var(--note-border);
  color: var(--text);
}

#form-result.error {
  background: var(--alert);
  border: 2px solid var(--alert-border);
  color: var(--text);
}

#form-result .close-btn {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  color: var(--text);
  padding: 0.25em 0.5em;
  line-height: 1;
}

#form-result .close-btn:hover {
  opacity: 0.7;
}

@media (min-width: 600px) {
  #contact-form .form-row {
    display: flex;
    gap: 1em;
    max-width: 40em;
  }

  #contact-form .form-row > p {
    flex: 1;
    margin: 0 0 0.5em 0;
  }

  #contact-form .form-row input {
    max-width: none;
  }
}
</style>

<script>
const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

// Field validation
const fields = {
  name: {
    element: document.getElementById('name'),
    error: document.getElementById('name-error'),
    validate: (value) => {
      if (!value.trim()) return 'Name is required';
      return '';
    }
  },
  email: {
    element: document.getElementById('email'),
    error: document.getElementById('email-error'),
    validate: (value) => {
      if (!value.trim()) return 'Email is required';
      const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
      if (!pattern.test(value)) return 'Please enter a valid email address';
      return '';
    }
  },
  subject: {
    element: document.getElementById('subject'),
    error: document.getElementById('subject-error'),
    validate: (value) => {
      if (!value.trim()) return 'Subject is required';
      return '';
    }
  },
  message: {
    element: document.getElementById('message'),
    error: document.getElementById('message-error'),
    validate: (value) => {
      if (!value.trim()) return 'Message is required';
      return '';
    }
  }
};

// Validate individual field
function validateField(fieldName) {
  const field = fields[fieldName];
  const errorMsg = field.validate(field.element.value);

  field.error.textContent = errorMsg;
  if (errorMsg) {
    field.element.classList.add('invalid');
  } else {
    field.element.classList.remove('invalid');
  }

  return !errorMsg;
}

// Hide result with fade-out
function hideResult() {
  result.classList.remove('visible');
  setTimeout(() => {
    if (!result.classList.contains('visible')) {
      result.innerHTML = '';
      result.className = '';
    }
  }, 300);
}

// Show result with fade-in
function showResult(message, type) {
  result.innerHTML = `${message}<button type="button" class="close-btn" aria-label="Close message">×</button>`;
  result.className = type;

  result.offsetHeight;

  result.classList.add('visible');

  result.querySelector('.close-btn').addEventListener('click', hideResult);
}

// Add blur validation and input handlers to all fields
Object.keys(fields).forEach(fieldName => {
  fields[fieldName].element.addEventListener('blur', () => {
    validateField(fieldName);
  });

  fields[fieldName].element.addEventListener('input', () => {
    if (fields[fieldName].error.textContent) {
      fields[fieldName].error.textContent = '';
      fields[fieldName].element.classList.remove('invalid');
    }

    if (result.classList.contains('visible')) {
      hideResult();
    }
  });
});

form.addEventListener('submit', function(e) {
  e.preventDefault();

  let isValid = true;
  Object.keys(fields).forEach(fieldName => {
    if (!validateField(fieldName)) {
      isValid = false;
    }
  });

  if (!isValid) {
    showResult('Please correct the errors above.', 'error');
    return;
  }

  document.getElementById('replyto').value = document.getElementById('email').value;
  document.getElementById('subject-hidden').value = document.getElementById('subject').value;
  document.getElementById('from-name-hidden').value = document.getElementById('name').value;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: json
  })
  .then(async (response) => {
    let json = await response.json();
    if (response.status == 200) {
      showResult('✓ Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      Object.keys(fields).forEach(fieldName => {
        fields[fieldName].element.classList.remove('invalid');
        fields[fieldName].error.textContent = '';
      });
    } else {
      showResult(json.message || 'Something went wrong. Please try again.', 'error');
    }
  })
  .catch(error => {
    showResult('Unable to send message. Please check your connection and try again.', 'error');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  });
});
</script>
