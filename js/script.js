// Validation the form with JS
$("#contact-form").validate({
    rules: {
        firstName: "required",
        email: {
            required: true,
            emailStrict: true
        },
        contact: {
            required: true,
            phoneNo: true
        },
        message: {
            required: true,
            maxlength: 500
        }
    },
    messages: {
        firstName: "Please enter your firstname.",
        email: {
            required: "Please enter your email.",
        },
        contact: {
            required: "Please enter your contact number."
        },
        message: {
            required: "This field is required.",
            maxlength: "Your message must be at maximum of 500 characters long."
        }
    },
    submitHandler: function () {
        $('#submit').val("Please wait...").addClass('disable');

        formData = {
            'firstName': $('input[name=firstName]').val(),
            'lastName': $('input[name=lastName]').val(),
            'email': $('input[name=email]').val(),
            'contact': $('input[name=contact]').val(),
            'message': $('textarea[name=message]').val()
        };

        $.ajax({
            url: "sendEmail.php",
            type: "POST",
            data: formData,
            success: function (data, textStatus, jqXHR) {
                if (data.status == 'success') { // If email was sent successfully, reset the form.
                    $('#status').text(data.message).removeClass('error-server').addClass('success');
                    $('#contact-form').closest('form').find("input[type=text], input[type=tel], textarea").val("");
                    $('#submit').val("Submit").removeClass('disable');
                } else if (data.status == 'fail') { // If email server went wrong, show error message
                    $('#status').text(data.message).removeClass('success').addClass('error-server');
                    $('#submit').val("Submit").removeClass('disable');
                }
                setTimeout(() => {
                    $('#status').text('').removeClass('success error-server');
                }, 4000);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // $('#status').text(jqXHR);
            }
        });
    }
});

// Custom Email Validation since default email is less strict
jQuery.validator.addMethod("emailStrict", function (value, element) {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value.trim());
}, 'Please enter a valid email address.');

// Custom Contact Tel number Validation
jQuery.validator.addMethod("phoneNo", function (phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
}, 'Please enter a valid phone number, 000-000-0000');