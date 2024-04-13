// main.ts
/// <reference path='./external.d.ts' />

const TYPE_POP_URL = "./res/typing-pop.mp3";
const SHOOT_POP_URL = "./res/shooting-sound-fx.mp3";
const SPREAD_POP_URL = "./res/pop.mp3";
const WRONG_SOUND_URL = "./res/wrong.mp3";

const typingPopSound: HTMLAudioElement = new Audio(TYPE_POP_URL);

class Vector {
  x: number;
  y: number;

  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add (v: Vector) {
    this.x += v.x;
    this.y += v.y;
  }
}

class DustParticle {
  x: number;
  y: number;
  life: number;
  _life: number;
  color: RGB | HSL;
  loop: NodeJS.Timeout;
  vector: Vector;
  private _vector: Vector;

  constructor (x: number, y: number, color: RGB | HSL, life: number = 200, vector: Vector) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vector = vector;
    this._vector = new Vector(vector.x, vector.y);
    this.life = life;
    this._life = life;

    let self = this;

    this.loop = setInterval(function () {
      self.life -= 1;
      self.x += self.vector.x;
      self.y += self.vector.y;
      self.vector.x -= self._vector.x / self._life;
      self.vector.y -= self._vector.y / self._life;
    }.bind(this), 10);
  }
}

class FireWorkParticle {
  x: number;
  y: number;
  life: number;
  speed: number;
  private _speed: number;
  private _life: number;
  color: RGB | HSL;
  loop: NodeJS.Timeout;

  constructor (x: number, y: number, color: RGB | HSL, life: number = 100) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = life;
    this._life = life;
    this.speed = 8;
    this._speed = 8;

    let self = this;

    this.loop = setInterval(function () {
      self.life -= 1;
      self.y -= self.speed;
      self.speed -= (self._speed / self._life);
    }.bind(this), 10);
  }

  explode(dusts: number = 8) {
    let dust_array = [];

    for (let i = 0; i < dusts; i++) {
      dust_array.push(new DustParticle(this.x, this.y, this.color, 120, new Vector(Math.random()*14 - 7, Math.random()*14 - 7)));
    }

    return dust_array;
  }
}

class RGB {
  r: number;
  g: number;
  b: number;
  alpha: number;

  constructor (r: number, g: number, b: number, alpha: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;
  }

  use() {
    if (this.alpha >= 1) {
      return `rgb(${this.r}, ${this.g}, ${this.b})`
    } else {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`
    }
  }
}

class HSL {
  h: number;
  s: number;
  l: number;
  alpha: number;

  constructor (h: number, s: number, l: number, alpha: number = 1) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.alpha = alpha;
  }
  
  use() {
    if (this.alpha < 1) {
      return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.alpha})`;
    } else {
      return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    }
  }
}

let pwDiv = document.querySelector('.password') as HTMLInputElement;
pwDiv.addEventListener("keydown", () => {
  playSound(TYPE_POP_URL);
});
pwDiv.addEventListener("keyup", checkRules);
let error = false;
let blackChar: string[] = [];
let whiteChar: string[] = [];
let used_passwords: string[] = [];

let applyRules: number[] = [];

// * 처음에 룰을 추가
// while (applyRules.length < 5) {
//   let selectIndex = Math.floor(Math.random()*rules.length);
//   if (applyRules.indexOf(selectIndex) < 0) { // 존재하지 않는 경우
//     applyRules.push(selectIndex);
//   }
// }

blackChar.push(String.fromCharCode(Math.floor(65+Math.random()*26)));
blackChar.push(String.fromCharCode(Math.floor(97+Math.random()*26)));
whiteChar.push(String.fromCharCode(Math.floor(65+Math.random()*26)));
whiteChar.push(String.fromCharCode(Math.floor(97+Math.random()*26)));

document.addEventListener('keydown', function (event) {
  if (event.key == 'Enter') {
    $(".apply-button").click();
  }
})

checkRules()

function checkRules() {
  error = false;

  let rulesDiv = document.querySelector(".rules") as HTMLDivElement;
  let password = pwDiv.value;
  let ascii_password: number[] = [];
  for (let i = 0; i < password.length; i++) {
    ascii_password.push(password.charCodeAt(i));
  }
  let tmp;

  rulesDiv.innerHTML = '';

  if (password.length < used_passwords.length + 6) {
    error = true;
    showRule(`비밀번호는 최소 ${used_passwords.length + 6}자 이상이어야 합니다.`);
  }
  if (password.length > used_passwords.length + 12) {
    error = true;
    showRule(`비밀번호는 최대 ${used_passwords.length + 12}자까지 설정할 수 있습니다.`);
  }
  if (password.match(/[^a-zA-Z0-9`~!.@#$%^&*|\\;:\/?_]/)) {
    tmp = password.match(/[^a-zA-Z0-9`~!.@#$%^&*|\\;:\/?_]/)
    error = true;
    let ruleDiv = showRule("비밀번호엔 영어, 숫자, 특수 기호 등 만이 들어갈 수 있습니다: "+tmp?.join(', '));
    
    let detailDiv = $('.detail');
    ruleDiv.addEventListener('mouseenter', () => {
      detailDiv.innerText = '가능한 특수기호: ` ~ ! . @ # $ % ^ & * | \\ ; : / ? _';
      detailDiv.style.display = 'block';
    });
    ruleDiv.addEventListener('mousemove', event => {
      const x = event.clientX + 16;
      const y = event.clientY;
      detailDiv.style.left = x + 'px'
      detailDiv.style.top = y + 'px'
    });
    ruleDiv.addEventListener('mouseleave', () => {
      detailDiv.style.display = 'none';
    });
  }
  /*
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
  if (password.match(/(.)\1\1/)) {
    error = true;
    tmp = (password.match(/(.)\1\1/) as RegExpMatchArray)[1];
    showRule("비밀번호엔 한 문자가 3번 이상 연속으로 반복될 수 없습니다: "+tmp);
  } else if (password.match(/(..+)\1/)) {
    error = true;
    tmp = (password.match(/(..+)\1/) as RegExpMatchArray)[1];
    showRule("비밀번호엔 한 단어가 2번 이상 연속으로 반복될 수 없습니다: "+tmp);
  }
  if (password.match(/(.).*\1.*\1.*\1.*\1/)) {
    error = true;
    tmp = (password.match(/(..+)\1/) as RegExpMatchArray)[1];
    showRule("비밀번호엔 한 문자가 5번 이상 나올 수 없습니다: "+tmp);
  }
  if(!isNaN(Number(password[0]))) {
    error = true
    showRule("비밀번호엔 첫 글자가 숫자로 시작할 수 없습니다.");
  }
  
  let uprepeat = 1;
  let downrepeat = 1;
  for (let i = 1; i < password.length; i++) {
    if (ascii_password[i-1] + 1 == ascii_password[i]) {
      uprepeat++;
    } else uprepeat = 1;
    if (ascii_password[i-1] - 1 == ascii_password[i]) {
      downrepeat++;
    } else downrepeat = 1;

    if(uprepeat >= 3 || downrepeat >= 3) {
      error = true;
      showRule(`비밀번호엔 문자가 순서대로 3번 이상 연속으로 올 수 없습니다: ${password[i-2]} - ${password[i-1]} - ${password[i]}`);
      break;
    }
  }
  
  uprepeat = 1;
  downrepeat = 1;
  for (let i = 2; i < password.length; i += 2) {
    if (ascii_password[i-2] == ascii_password[i] + 1) {
      uprepeat++;
    } else uprepeat = 1;
    if (ascii_password[i-2] == ascii_password[i] - 1) {
      downrepeat++;
    } else downrepeat = 1;

    if(uprepeat >= 3 || downrepeat >= 3) {
      error = true;
      showRule(`비밀번호엔 문자가 순서대로 3번 이상 한 글자 건너 뛰어 연속으로 올 수 없습니다: ${password[i-4]} - ${password[i-2]} - ${password[i]}`);
      break;
    }
  }

  */

  for (let i of applyRules) {
    if (rules[i < 0 ? -i : i].check(password)) {
      // 로봇이 아닙니다
      if (rules[i < 0 ? -i : i].check(password) == 1001) {
        showRule(rules[i].text, 'check')
      } else {
        error = true;
        if (i < 0) {
          showRule('비밀번호엔... 아무튼 안됩니다. 알아서 생각해보세요.');
        } else {
          let ruleDiv = showRule(rules[i].text);
          if (rules[i].hasOwnProperty('detail')) {
            let detailDiv = $('.detail');
            ruleDiv.addEventListener('mouseenter', () => {
              detailDiv.innerText = rules[i].detail
              detailDiv.style.display = 'block';
            });
            ruleDiv.addEventListener('mousemove', event => {
              const x = event.clientX + 16;
              const y = event.clientY;
              detailDiv.style.left = x + 'px'
              detailDiv.style.top = y + 'px'
            });
            ruleDiv.addEventListener('mouseleave', () => {
              detailDiv.style.display = 'none';
            });
          }
        }
      }
    }
  }
  
  for (let used_password of used_passwords) {
    // let overlap_count = 0;
    // for (let c of pw) {
    //   if (password.indexOf(c) != -1) {
    //     overlap_count++;
    //   }
    // }
    // if (overlap_count >= 6) {
    //   showRule("비밀번호엔 이미 사용했던 비밀번호가 6글자 이상 포함될 수 없습니다: "+pw);
    //   error = true
    //   break;
    // }
    if (password.includes(used_password)) {
      showRule("새 비밀번호엔 이전에 사용했던 비밀번호가 포함될 수 없습니다.");
      error = true;
    }
  }

  if (!error) {
    $("#pw-wrap").style.borderColor = "";
    showRule("사용 가능한 비밀 번호입니다.", 'check');
    $(".apply-button").classList.add("actived");
    $(".apply-button").removeEventListener("click", notApplyPassword);
    $(".apply-button").addEventListener("click", applyPassword);
  } else {
    $(".apply-button").classList.remove("actived");
    $(".apply-button").removeEventListener("click", applyPassword);
    $(".apply-button").addEventListener("click", notApplyPassword);
  }

  (document.querySelector('#wrap') as HTMLDivElement).style.height 
  = `${$('#pw-wrap').offsetHeight + 12 + $('.rules').offsetHeight}px`;
}

function showRule(content: string, icon: string = 'block') {
  let rulesDiv = document.querySelector(".rules") as HTMLDivElement;
  let rule = document.createElement("div");
  rule.classList.add(icon);
  rule.innerHTML = `${content}`
  rulesDiv.append(rule);

  return rule;
}

function $(q: string) {
  return document.querySelector(q) as HTMLDivElement;
}

function applyPassword() {
  let pw = document.querySelector(".password") as HTMLInputElement;
  used_passwords.push(pw.value);
  // pw.value = '';
  (document.querySelector("title") as HTMLTitleElement).innerText = "새 비밀번호를 입력해 주세요";

  let no_rules: number[] = [];

  for (let i = 0; i < rules.length; i++) {
    if (applyRules.indexOf(i) == -1) {
      no_rules.push(i);
    }
  }

  if (no_rules.length > 0) {
    // 20번째부터 12번째마다 비밀 룰 추가
    let ranIdx = Math.floor(Math.random() * no_rules.length);
    if(applyRules.length >= 20 && (applyRules.length-20) % 12 == 0) {
      applyRules.push(-no_rules[ranIdx]);
    } else {
      applyRules.push(no_rules[ranIdx]);
    }
  }

  $('.re-pw-count').innerText = `비밀번호 바꾼 횟수: ${used_passwords.length}`
  $('.re-pw-count').style.fontSize = '13px';
  $('.re-pw-count').style.opacity = '1';
  $('.re-pw-count').animate([
    {
      background: "#c0c0c0"
    },
    {
      background: "#404040"
    }
  ], {
    duration: 1500,
  })
  $('#pw-wrap').style.width = `${240 + used_passwords.length * 15}px`

  $('#pw-wrap').classList.add('correct-eff');
  setTimeout(function () {$('#pw-wrap').classList.remove('correct-eff');}, 400)

  firework_particle();

  checkRules();
}

function notApplyPassword() {
  let pw_wrap = $("#pw-wrap");
  if (!pw_wrap.classList.contains('shake-eff')) {
    pw_wrap.classList.add('shake-eff');
    setTimeout(function () {
      pw_wrap.classList.remove('shake-eff');
    }, 600)
  } else {
    pw_wrap.classList.remove('shake-eff');
    setTimeout(function () {
      pw_wrap.classList.add('shake-eff');
    }, 1)
  }
  playSound(WRONG_SOUND_URL);
}

function firework_particle() {
  const SIZE = 4;
  let time = 0;

  let canvas = document.querySelector('.particle') as HTMLCanvasElement;
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  let fw_ptcls: FireWorkParticle[] = [];
  let dust_ptcls: DustParticle[] = [];

  playSound(SHOOT_POP_URL);

  for (let i = 0; i < applyRules.length; i++) {
    let x = Math.random() * 1000 + 100;
    fw_ptcls.push(new FireWorkParticle(x, canvas.height, new HSL(Math.random() * 360, 66, 40), Math.random()*40+20));
  }

  let fw_loop = setInterval(function () {
    // if (time >= 10) {
    //   time = 0
    //   console.log(dust_ptcls[0], dust_ptcls.length);
    // }
    // time += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fw_ptcls.forEach(function (p) {
      ctx.fillStyle = p.color.use();
      ctx.fillRect(p.x - SIZE/2, p.y - SIZE/2, SIZE, SIZE);

      if(p.life <= 0) {
        clearInterval(p.loop);
        dust_ptcls = dust_ptcls.concat(p.explode(48));
        fw_ptcls.splice(fw_ptcls.indexOf(p), 1);
        playSound(SPREAD_POP_URL);
      }
    })

    dust_ptcls.forEach(function (p) {
      ctx.fillStyle = p.color.use();
      let s = SIZE*(Math.random()*1+0.5);
      ctx.fillRect(p.x - s/2, p.y - s/2, s, s);

      if(p.life <= 0) {
        clearInterval(p.loop);
        dust_ptcls.splice(dust_ptcls.indexOf(p), 1);
      }
    })

    if (fw_ptcls.length <= 0 && dust_ptcls.length <= 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      clearInterval(fw_loop);
    }
  }, 1000/60)
}

function playSound(url: string) {
  let audio = new Audio(url);
  audio.play();
}