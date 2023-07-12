// main.ts
/// <reference path='./external.d.ts' />
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
    };
    return Vector;
}());
var DustParticle = /** @class */ (function () {
    function DustParticle(x, y, color, life, vector) {
        if (life === void 0) { life = 200; }
        this.x = x;
        this.y = y;
        this.color = color;
        this.vector = vector;
        this._vector = new Vector(vector.x, vector.y);
        this.life = life;
        this._life = life;
        var self = this;
        this.loop = setInterval(function () {
            self.life -= 1;
            self.x += self.vector.x;
            self.y += self.vector.y;
            self.vector.x -= self._vector.x / self._life;
            self.vector.y -= self._vector.y / self._life;
        }.bind(this), 10);
    }
    return DustParticle;
}());
var FireWorkParticle = /** @class */ (function () {
    function FireWorkParticle(x, y, color, life) {
        if (life === void 0) { life = 100; }
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = life;
        this._life = life;
        this.speed = 8;
        this._speed = 8;
        var self = this;
        this.loop = setInterval(function () {
            self.life -= 1;
            self.y -= self.speed;
            self.speed -= (self._speed / self._life);
        }.bind(this), 10);
    }
    FireWorkParticle.prototype.explode = function (dusts) {
        if (dusts === void 0) { dusts = 8; }
        var dust_array = [];
        for (var i = 0; i < dusts; i++) {
            dust_array.push(new DustParticle(this.x, this.y, this.color, 120, new Vector(Math.random() * 14 - 7, Math.random() * 14 - 7)));
        }
        return dust_array;
    };
    return FireWorkParticle;
}());
var RGB = /** @class */ (function () {
    function RGB(r, g, b, alpha) {
        if (alpha === void 0) { alpha = 1; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
    }
    RGB.prototype.use = function () {
        if (this.alpha >= 1) {
            return "rgb(".concat(this.r, ", ").concat(this.g, ", ").concat(this.b, ")");
        }
        else {
            return "rgba(".concat(this.r, ", ").concat(this.g, ", ").concat(this.b, ", ").concat(this.alpha, ")");
        }
    };
    return RGB;
}());
var HSL = /** @class */ (function () {
    function HSL(h, s, l, alpha) {
        if (alpha === void 0) { alpha = 1; }
        this.h = h;
        this.s = s;
        this.l = l;
        this.alpha = alpha;
    }
    HSL.prototype.use = function () {
        if (this.alpha < 1) {
            return "hsla(".concat(this.h, ", ").concat(this.s, "%, ").concat(this.l, "%, ").concat(this.alpha, ")");
        }
        else {
            return "hsl(".concat(this.h, ", ").concat(this.s, "%, ").concat(this.l, "%)");
        }
    };
    return HSL;
}());
var pwDiv = document.querySelector('.password');
pwDiv.addEventListener("keyup", checkRules);
var error = false;
var blackChar = [];
var whiteChar = [];
var used_password = [];
var applyRules = [];
while (applyRules.length < 10) {
    var selectIndex = Math.floor(Math.random() * rules.length);
    if (applyRules.indexOf(selectIndex) < 0) { // 존재하지 않는 경우
        applyRules.push(selectIndex);
    }
}
blackChar.push(String.fromCharCode(Math.floor(65 + Math.random() * 26)));
blackChar.push(String.fromCharCode(Math.floor(97 + Math.random() * 26)));
whiteChar.push(String.fromCharCode(Math.floor(65 + Math.random() * 26)));
whiteChar.push(String.fromCharCode(Math.floor(97 + Math.random() * 26)));
document.addEventListener('keydown', function (event) {
    if (event.key == 'Enter') {
        $(".apply-button").click();
    }
});
checkRules();
function checkRules() {
    error = false;
    var rulesDiv = document.querySelector(".rules");
    var password = pwDiv.value;
    var ascii_password = [];
    for (var i = 0; i < password.length; i++) {
        ascii_password.push(password.charCodeAt(i));
    }
    var tmp;
    rulesDiv.innerHTML = '';
    if (password.length < used_password.length + 6) {
        error = true;
        showRule("\uBE44\uBC00\uBC88\uD638\uB294 \uCD5C\uC18C ".concat(used_password.length + 6, "\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4."));
    }
    if (password.length > used_password.length + 12) {
        error = true;
        showRule("\uBE44\uBC00\uBC88\uD638\uB294 \uCD5C\uB300 ".concat(used_password.length + 12, "\uC790\uAE4C\uC9C0 \uC124\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."));
    }
    if (password.match(/\s/)) {
        error = true;
        showRule("비밀번호엔 공백이 들어갈 수 없습니다.");
    }
    if (!password.match(/[A-Z]/)) {
        error = true;
        showRule("비밀번호엔 대문자가 하나 이상 들어가야합니다.");
    }
    if (!password.match(/[a-z]/)) {
        error = true;
        showRule("비밀번호엔 소문자가 하나 이상 들어가야합니다.");
    }
    if (!password.match(/[0-9]/)) {
        error = true;
        showRule("비밀번호엔 숫자가 하나 이상 들어가야합니다.");
    }
    if (!password.match(/[.`~!@#$%^&*|\\;:\/?_]/)) {
        error = true;
        showRule("비밀번호엔 특수기호가 하나 이상 들어가야합니다.");
    }
    if (password.match(/[^a-zA-Z0-9`~!.@#$%^&*|\\;:\/?_]/)) {
        tmp = password.match(/[^a-zA-Z0-9`~!.@#$%^&*|\\;:\/?_]/);
        error = true;
        var ruleDiv = showRule("비밀번호엔 영어, 숫자, 특수 기호 등 만이 들어갈 수 있습니다: " + (tmp === null || tmp === void 0 ? void 0 : tmp.join(', ')));
        var detailDiv_1 = $('.detail');
        ruleDiv.addEventListener('mouseenter', function () {
            detailDiv_1.innerText = '가능한 특수기호: ` ~ ! . @ # $ % ^ & * | \\ ; : / ? _';
            detailDiv_1.style.display = 'block';
        });
        ruleDiv.addEventListener('mousemove', function (event) {
            var x = event.clientX + 16;
            var y = event.clientY;
            detailDiv_1.style.left = x + 'px';
            detailDiv_1.style.top = y + 'px';
        });
        ruleDiv.addEventListener('mouseleave', function () {
            detailDiv_1.style.display = 'none';
        });
    }
    if (password.match(/(.)\1\1/)) {
        error = true;
        tmp = password.match(/(.)\1\1/)[1];
        showRule("비밀번호엔 한 문자가 3번 이상 연속으로 반복될 수 없습니다: " + tmp);
    }
    else if (password.match(/(..+)\1/)) {
        error = true;
        tmp = password.match(/(..+)\1/)[1];
        showRule("비밀번호엔 한 단어가 2번 이상 연속으로 반복될 수 없습니다: " + tmp);
    }
    if (password.match(/(.).*\1.*\1.*\1.*\1/)) {
        error = true;
        tmp = password.match(/(..+)\1/)[1];
        showRule("비밀번호엔 한 문자가 5번 이상 나올 수 없습니다: " + tmp);
    }
    if (!isNaN(Number(password[0]))) {
        error = true;
        showRule("비밀번호엔 첫 글자가 숫자로 시작할 수 없습니다.");
    }
    var uprepeat = 1;
    var downrepeat = 1;
    for (var i = 1; i < password.length; i++) {
        if (ascii_password[i - 1] + 1 == ascii_password[i]) {
            uprepeat++;
        }
        else
            uprepeat = 1;
        if (ascii_password[i - 1] - 1 == ascii_password[i]) {
            downrepeat++;
        }
        else
            downrepeat = 1;
        if (uprepeat >= 3 || downrepeat >= 3) {
            error = true;
            showRule("\uBE44\uBC00\uBC88\uD638\uC5D4 \uBB38\uC790\uAC00 \uC21C\uC11C\uB300\uB85C 3\uBC88 \uC774\uC0C1 \uC5F0\uC18D\uC73C\uB85C \uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: ".concat(password[i - 2], " - ").concat(password[i - 1], " - ").concat(password[i]));
            break;
        }
    }
    uprepeat = 1;
    downrepeat = 1;
    for (var i = 2; i < password.length; i += 2) {
        if (ascii_password[i - 2] == ascii_password[i] + 1) {
            uprepeat++;
        }
        else
            uprepeat = 1;
        if (ascii_password[i - 2] == ascii_password[i] - 1) {
            downrepeat++;
        }
        else
            downrepeat = 1;
        if (uprepeat >= 3 || downrepeat >= 3) {
            error = true;
            showRule("\uBE44\uBC00\uBC88\uD638\uC5D4 \uBB38\uC790\uAC00 \uC21C\uC11C\uB300\uB85C 3\uBC88 \uC774\uC0C1 \uD55C \uAE00\uC790 \uAC74\uB108 \uB6F0\uC5B4 \uC5F0\uC18D\uC73C\uB85C \uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: ".concat(password[i - 4], " - ").concat(password[i - 2], " - ").concat(password[i]));
            break;
        }
    }
    var _loop_1 = function (i) {
        if (rules[i < 0 ? -i : i].check(password)) {
            // 로봇이 아닙니다
            if (rules[i < 0 ? -i : i].check(password) == 1001) {
                showRule(rules[i].text, 'check');
            }
            else {
                error = true;
                if (i < 0) {
                    showRule('비밀번호엔... 아무튼 안됩니다. 알아서 생각해보세요.');
                }
                else {
                    var ruleDiv = showRule(rules[i].text);
                    if (rules[i].hasOwnProperty('detail')) {
                        var detailDiv_2 = $('.detail');
                        ruleDiv.addEventListener('mouseenter', function () {
                            detailDiv_2.innerText = rules[i].detail;
                            detailDiv_2.style.display = 'block';
                        });
                        ruleDiv.addEventListener('mousemove', function (event) {
                            var x = event.clientX + 16;
                            var y = event.clientY;
                            detailDiv_2.style.left = x + 'px';
                            detailDiv_2.style.top = y + 'px';
                        });
                        ruleDiv.addEventListener('mouseleave', function () {
                            detailDiv_2.style.display = 'none';
                        });
                    }
                }
            }
        }
    };
    for (var _i = 0, applyRules_1 = applyRules; _i < applyRules_1.length; _i++) {
        var i = applyRules_1[_i];
        _loop_1(i);
    }
    for (var _a = 0, used_password_1 = used_password; _a < used_password_1.length; _a++) {
        var pw = used_password_1[_a];
        var overlap_count = 0;
        for (var _b = 0, pw_1 = pw; _b < pw_1.length; _b++) {
            var c = pw_1[_b];
            if (password.indexOf(c) != -1) {
                overlap_count++;
            }
        }
        if (overlap_count >= 6) {
            showRule("비밀번호엔 이미 사용했던 비밀번호가 6글자 이상 포함될 수 없습니다: " + pw);
            error = true;
            break;
        }
    }
    if (!error) {
        $("#pw-wrap").style.borderColor = "";
        showRule("사용 가능한 비밀 번호입니다.", 'check');
        $(".apply-button").classList.add("actived");
        $(".apply-button").removeEventListener("click", notApplyPassword);
        $(".apply-button").addEventListener("click", applyPassword);
    }
    else {
        $(".apply-button").classList.remove("actived");
        $(".apply-button").removeEventListener("click", applyPassword);
        $(".apply-button").addEventListener("click", notApplyPassword);
    }
    document.querySelector('#wrap').style.height
        = "".concat($('#pw-wrap').offsetHeight + 12 + $('.rules').offsetHeight, "px");
}
function showRule(content, icon) {
    if (icon === void 0) { icon = 'block'; }
    var rulesDiv = document.querySelector(".rules");
    var rule = document.createElement("div");
    rule.classList.add(icon);
    rule.innerHTML = "".concat(content);
    rulesDiv.append(rule);
    return rule;
}
function $(q) {
    return document.querySelector(q);
}
function applyPassword() {
    var pw = document.querySelector(".password");
    used_password.push(pw.value);
    pw.value = '';
    document.querySelector("title").innerText = "새 비밀번호를 입력해 주세요";
    var no_rules = [];
    for (var i = 0; i < rules.length; i++) {
        if (applyRules.indexOf(i) == -1) {
            no_rules.push(i);
        }
    }
    if (no_rules.length > 0) {
        var ranIdx = Math.floor(Math.random() * no_rules.length);
        if (applyRules.length - 10 >= 6 && applyRules.length % 6 == 0) {
            ranIdx *= -1;
        }
        applyRules.push(no_rules[ranIdx]);
    }
    $('.re-pw-count').innerText = "\uBE44\uBC00\uBC88\uD638 \uBC14\uAFBC \uD69F\uC218: ".concat(used_password.length);
    $('.re-pw-count').style.fontSize = '13px';
    $('.re-pw-count').style.opacity = '1';
    $('#pw-wrap').style.width = "".concat(240 + used_password.length * 15, "px");
    $('#pw-wrap').classList.add('correct-eff');
    setTimeout(function () { $('#pw-wrap').classList.remove('correct-eff'); }, 400);
    firework_particle();
    checkRules();
}
function notApplyPassword() {
    var pw_wrap = $("#pw-wrap");
    if (!pw_wrap.classList.contains('shake-eff')) {
        pw_wrap.classList.add('shake-eff');
        setTimeout(function () {
            pw_wrap.classList.remove('shake-eff');
        }, 600);
    }
    else {
        pw_wrap.classList.remove('shake-eff');
        setTimeout(function () {
            pw_wrap.classList.add('shake-eff');
        }, 1);
    }
}
function firework_particle() {
    var SIZE = 4;
    var time = 0;
    var canvas = document.querySelector('.particle');
    var ctx = canvas.getContext('2d');
    var fw_ptcls = [];
    var dust_ptcls = [];
    for (var i = 0; i < applyRules.length - 5; i++) {
        var x = Math.random() * 1000 + 100;
        fw_ptcls.push(new FireWorkParticle(x, canvas.height, new HSL(Math.random() * 360, 66, 40), Math.random() * 30 + 30));
    }
    var fw_loop = setInterval(function () {
        // if (time >= 10) {
        //   time = 0
        //   console.log(dust_ptcls[0], dust_ptcls.length);
        // }
        // time += 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fw_ptcls.forEach(function (p) {
            ctx.fillStyle = p.color.use();
            ctx.fillRect(p.x - SIZE / 2, p.y - SIZE / 2, SIZE, SIZE);
            if (p.life <= 0) {
                clearInterval(p.loop);
                dust_ptcls = dust_ptcls.concat(p.explode(48));
                fw_ptcls.splice(fw_ptcls.indexOf(p), 1);
            }
        });
        dust_ptcls.forEach(function (p) {
            ctx.fillStyle = p.color.use();
            var s = SIZE * (Math.random() * 1 + 0.5);
            ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
            if (p.life <= 0) {
                clearInterval(p.loop);
                dust_ptcls.splice(dust_ptcls.indexOf(p), 1);
            }
        });
        if (fw_ptcls.length <= 0 && dust_ptcls.length <= 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearInterval(fw_loop);
        }
    }, 1000 / 60);
}
