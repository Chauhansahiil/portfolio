$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["Aspiring Data Analyst"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    var typed = new Typed(".typing-2", {
        strings: ["Aspiring Data Analyst with an AI background"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });

    // contact form -> SheetDB (with validation)
    var CONTACT_URL = (window.SITE_CONFIG && SITE_CONFIG.WORKER_URL) ? SITE_CONFIG.WORKER_URL + "/contact" : "";
    var MAX_WORDS = 300;
    var form = document.getElementById("contact-form");

    if (form) {
        var f = form.elements;
        var status = document.getElementById("form-status");
        var sendBtn = form.querySelector("button[type=submit]");
        var counter = document.getElementById("word-count");

        var EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
        var NAME_RE = /^[\p{L}][\p{L} .'-]{1,59}$/u;
        // domains people commonly use; anything very close to one (but not equal) is flagged as a typo
        var POPULAR = ["gmail.com","yahoo.com","yahoo.in","yahoo.co.in","outlook.com","outlook.in","hotmail.com",
                       "hotmail.co.uk","live.com","icloud.com","rediffmail.com","protonmail.com","proton.me",
                       "aol.com","mail.com","msn.com","me.com"];
        // 3+ letter endings we accept (2-letter country endings like .in, .de, .uk are always accepted)
        var TLDS = ["com","org","net","edu","gov","info","biz","dev","app","io","ai","tech","online","site",
                    "xyz","cloud","email","name","pro","mil","int","asia","eu"];

        function distance(a, b){
            var d = [], i, k;
            for (i = 0; i <= a.length; i++) { d[i] = [i]; }
            for (k = 1; k <= b.length; k++) { d[0][k] = k; }
            for (i = 1; i <= a.length; i++) {
                for (k = 1; k <= b.length; k++) {
                    d[i][k] = Math.min(d[i-1][k] + 1, d[i][k-1] + 1,
                        d[i-1][k-1] + (a[i-1] === b[k-1] ? 0 : 1));
                }
            }
            return d[a.length][b.length];
        }
        function suggestDomain(domain){
            if (POPULAR.indexOf(domain) > -1) return "";
            for (var n = 0; n < POPULAR.length; n++) {
                if (distance(domain, POPULAR[n]) <= 2) return POPULAR[n];
            }
            return "";
        }
        function badEnding(domain){
            var tld = domain.split(".").pop();
            return tld.length > 2 && TLDS.indexOf(tld) === -1;
        }

        function showError(field, msg){
            var box = document.getElementById("err-" + field);
            box.textContent = msg;
            var input = f[field];
            if (msg) { input.classList.add("invalid"); } else { input.classList.remove("invalid"); }
            return !msg;
        }
        function countWords(text){
            var m = text.match(/\S+/g);
            return m ? m.length : 0;
        }

        // phone: digits only, max 10 (also cleans pasted text)
        f["phone"].addEventListener("input", function(){
            this.value = this.value.replace(/\D/g, "").slice(0, 10);
            showError("phone", "");
        });

        // message: live word counter, hard stop at 300 words
        f["message"].addEventListener("input", function(){
            var parts = this.value.split(/(\s+)/);
            var words = 0, out = "";
            for (var k = 0; k < parts.length; k++) {
                if (parts[k] && !/^\s+$/.test(parts[k])) {
                    words++;
                    if (words > MAX_WORDS) break;
                }
                out += parts[k];
            }
            if (words > MAX_WORDS) { this.value = out.replace(/\s+$/, ""); }
            var n = countWords(this.value);
            counter.textContent = n + " / " + MAX_WORDS + " words";
            counter.classList.toggle("limit", n >= MAX_WORDS);
            showError("message", "");
        });

        f["name"].addEventListener("input", function(){ showError("name", ""); });
        f["email"].addEventListener("input", function(){ showError("email", ""); });

        function validate(){
            var ok = true, first = null;
            function fail(field, msg){ showError(field, msg); ok = false; if (!first) first = f[field]; }

            var name = f["name"].value.trim();
            if (!name) fail("name", "Please enter your name.");
            else if (!NAME_RE.test(name)) fail("name", "Use letters only (at least 2 characters).");
            else showError("name", "");

            var email = f["email"].value.trim();
            var domain = email.split("@")[1] ? email.split("@")[1].toLowerCase() : "";
            if (!email) fail("email", "Please enter your email address.");
            else if (!EMAIL_RE.test(email)) fail("email", "Enter a valid email address, e.g. name@gmail.com.");
            else if (suggestDomain(domain)) fail("email", "Did you mean " + email.split("@")[0] + "@" + suggestDomain(domain) + "?");
            else if (badEnding(domain)) fail("email", "That email ending looks wrong (." + domain.split(".").pop() + "). Please check it.");
            else showError("email", "");

            var phone = f["phone"].value;
            if (phone && !/^\d{10}$/.test(phone)) fail("phone", "Phone number must be exactly 10 digits.");
            else showError("phone", "");

            var msg = f["message"].value.trim();
            if (!msg) fail("message", "Please write a message.");
            else if (countWords(msg) > MAX_WORDS) fail("message", "Message must be 300 words or fewer.");
            else showError("message", "");

            if (first) first.focus();
            return ok;
        }

        form.addEventListener("submit", function(e){
            e.preventDefault();
            // spam trap filled in -> pretend success, send nothing
            if (f["website"].value) { form.reset(); return; }
            status.className = "";
            status.textContent = "";
            if (!validate()) return;

            var payload = {
                name: f["name"].value.trim(),
                email: f["email"].value.trim(),
                phone: f["phone"].value,
                message: f["message"].value.trim(),
                website: ""
            };
            sendBtn.disabled = true;
            sendBtn.textContent = "Sending...";
            if (!CONTACT_URL) { status.className = "err"; status.textContent = "Contact form is not connected yet. Please email me at chauhansahil03115@gmail.com."; sendBtn.disabled = false; sendBtn.textContent = "Send message"; return; }
            fetch(CONTACT_URL, {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(function(res){
                if (!res.ok) throw new Error("HTTP " + res.status);
                form.reset();
                counter.textContent = "0 / " + MAX_WORDS + " words";
                counter.classList.remove("limit");
                status.className = "ok";
                status.textContent = "Thank you! Your message was sent.";
            })
            .catch(function(){
                status.className = "err";
                status.textContent = "Sorry, the message could not be sent. Please email me at chauhansahil03115@gmail.com.";
            })
            .finally(function(){
                sendBtn.disabled = false;
                sendBtn.textContent = "Send message";
            });
        });
    }
});