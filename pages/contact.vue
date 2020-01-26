<template>
  <div class="grax_section" id="contact">
    <div class="grax_contact">
      <div class="container">
        <div class="center">
          <div class="grax_title_holder mt-10">
            <h3><span>Get in Touch</span></h3>
          </div>
        </div>
        <div class="contact_inner">
          <div class="left">
            <ul>
              <li>
                <div class="inner">
                  <span>
                    <a class="href_location" href="#">
                      Palma de Mallorca, Spain
                    </a>
                  </span>
                </div>
              </li>
              <!-- <li>
                  <div class="inner">
                    <img class="svg" src="img/svg/telephone.svg" alt="" />
                    <span>
                      <a href="tel:+55 (77) 100 20 20">+55 (77) 100 20 20</a>
                    </span>
                  </div>
                </li> -->
              <li>
                <div class="inner">
                  <span>
                    <a href="mailto:debs_obrien@yahoo.co.uk">
                      debs_obrien@yahoo.co.uk
                    </a>
                  </span>
                </div>
              </li>
              <li>
                <div class="inner">
                  <span>
                    <a href="https://twitter.com/debs_obrien">
                      Twitter: debs_obrien
                    </a>
                  </span>
                </div>
              </li>
              <li>
                <div class="inner">
                  <span>
                    <a
                      href="https://www.linkedin.com/in/debbie-o-brien-1a199975/"
                    >
                      LinkedIn: debbie-o-brien
                    </a>
                  </span>
                </div>
              </li>
              <!-- <li>
                  <div class="inner">
                    <img class="svg" src="img/svg/telegram.svg" alt="" />
                    <span>
                      <a href="https://t.me/@telegramNickName" target="_blank">
                        @telegramNickName
                      </a>
                    </span>
                  </div>
                </li> -->
              <!-- <li>
                  <div class="inner">
                    <img class="svg" src="img/svg/whatsapp.svg" alt="" />
                    <span>
                      <a href="https://wa.me/@whatsappNickName" target="_blank">
                        @whatsappNickName
                      </a>
                    </span>
                  </div>
                </li> -->
            </ul>
          </div>
          <div class="right">
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              class="contact_form px-4"
              id="contact_form"
              action="/thank-you/"
            >
              <input type="hidden" name="form-name" value="contact" />

              <p class="hidden">
                <label>
                  Don’t fill this out if you're human:
                  <input name="bot-field" />
                </label>
              </p>

              <div class="first_row">
                <ul>
                  <li>
                    <input
                      name="name"
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      required
                    />
                  </li>
                  <li>
                    <input
                      name="email"
                      id="email"
                      type="text"
                      placeholder="Your Email"
                      required
                    />
                  </li>
                </ul>
              </div>
              <div class="second_row">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button class="flex justify-start grax_button" type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*** 12. Contact ***/

.grax_contact .contact_inner {
  width: 100%;
  height: auto;
  padding-top: 100px;
  display: flex;
  margin-bottom: 100px;
}
.grax_contact .contact_inner .left {
  width: 40%;
  height: auto;
}
.grax_contact .contact_inner .left ul {
  margin: 0px;
  list-style-type: none;
}
.grax_contact .contact_inner .left ul li {
  margin: 0px 0px 10px 0px;
  width: 100%;
  float: left;
  list-style-type: none;
}
.grax_contact .contact_inner .left ul li .inner {
  width: 100%;
  height: auto;
}
.grax_contact .contact_inner .left ul li .inner .svg {
  position: absolute;
  left: 0px;
  top: 8px;
  color: #ff214f;
  width: 20px;
  height: 20px;
}
.grax_contact .contact_inner .left ul li .inner span {
  padding-left: 35px;
}

.grax_contact .contact_inner .right {
  width: 60%;
  height: auto;
  position: relative;
  top: -10px;
}
.grax_contact .contact_inner .right .first_row {
  width: 100%;
  height: auto;
  margin-bottom: 15px;
}
.grax_contact .contact_inner .right .first_row ul {
  margin: 0px 0px 0px -20px;
  list-style-type: none;
}
.grax_contact .contact_inner .right .first_row ul li {
  margin: 0px 0px 25px 0px;
  width: 50%;
  padding-left: 20px;
}
.grax_contact .contact_inner .right .first_row ul li input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #333;
  width: 100%;
  padding: 0px 20px 0px 0px !important;
  color: #333;

  transition: all 0.3s ease;
}
.grax_contact .contact_inner .right .first_row ul li input:focus {
  outline: none;
  background-color: transparent;
  border-bottom-color: #000;
}
.grax_contact .contact_inner .right .second_row {
  width: 100%;
  height: auto;
  float: left;
  clear: both;
  margin-bottom: 20px;
}
.grax_contact .contact_inner .right textarea {
  border: none;
  background-color: transparent;
  border-bottom: 1px solid #333;
  width: 100%;
  resize: none;
  padding: 0px 20px 0px 0px !important;
  color: #333;

  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.grax_contact .contact_inner .right textarea:focus {
  outline: none;
  background-color: transparent;
  border-bottom-color: #000;
}
.grax_contact .empty_notice {
  color: #ff214f;
  margin-bottom: 7px;
  display: none;
  text-align: left;
}
.grax_contact .contact_error {
  color: #ff214f;
  text-align: left;
}
.grax_contact .returnmessage {
  color: #0064ff;
  margin-bottom: 7px;
  text-align: left;
}
.grax_title_holder {
  width: 100%;
  height: auto;
  clear: both;
  float: left;
  text-align: center;
}
.grax_title_holder h3 {
  font-family: 'Saira';
  font-weight: 700;
  font-size: 30px;
  text-transform: uppercase;
}
.grax_title_holder h3 span {
  position: relative;
}
.grax_title_holder h3 span:before {
  position: absolute;
  content: '';
  width: 100%;
  height: 4px;
  background-color: #ff214f;
  left: 0px;
  bottom: -5px;
}
</style>
