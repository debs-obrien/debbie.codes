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
              action="/thank-you"
            >
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

<style scoped></style>
