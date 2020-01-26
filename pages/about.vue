<template>
  <div class="grax_section" id="about">
    <div class="grax_about">
      <div class="container">
        <div class="about_inner">
          <div class="left">
            <img
              src="https://res.cloudinary.com/debsobrien/image/upload/v1579977198/ME/debbie-mvp_gcgsof.png"
              alt="Debbie O'Brien - Microsoft Most Valuable Professional"
            />
          </div>
          <div class="right">
            <div class="title">
              <span class="top">Hello There!</span>
              <h3>
                I'm Debbie O'Brien and
                <span class="grax_tm_animation_text_word_2"></span>
              </h3>
            </div>
            <div class="text">
              <p>
                I am a Developer Experience Engineer and Tech Consultant at
                Patterson Agency with over 10 years experience in Frontend
                development. I am a Microsoft Most Valuable Professional and a
                Google Developer Expert as well as a Cloudinary Media Developer
                Expert.
              </p>
              <p>
                I have a special love for JavaScript frameworks especially
                Vue.JS and Nuxt.js and improving performance with webpack and of
                course the JAMstack. I hold a Frontend and FullStack Tech Degree
                and am Microsoft certified. I am an international speaker and
                organiser of MallorcaJS and VueSpain. I contribute to both
                webpack and Nuxt.js. I am a teacher at Vue School and a writer
                for Ultimate Courses.
              </p>
            </div>
            <div class="buttons my-8">
              <div class="grax_button">
                <a href="#contact">Send Message</a>
              </div>
            </div>

            <div class="grax_progress">
              <div class="flex flex-wrap justify-between">
                <img
                  src="https://res.cloudinary.com/debsobrien/image/upload/c_scale,w_200/v1579978905/ME/2019-GDE-Web-Technologies-Badge_azr0mi"
                  alt="Google Developer Expert"
                />
                <img
                  class="block lg:hidden"
                  src="https://res.cloudinary.com/debsobrien/image/upload/c_fit,h_160/v1579977213/ME/mvp_o5w23e.png"
                  alt="Microsoft Most Valuable Professional"
                />
                <img
                  src="https://res.cloudinary.com/debsobrien/image/upload/c_scale,h_200/v1579979188/ME/cloudinary-mde_pky7q1.jpg"
                  alt="Cloudinary Media Developer Expert"
                />
              </div>
              <!-- <div class="progress_inner" data-value="95" data-color="#ff214f">
                <span>
                  <span class="label">Web Development</span>
                  <span class="number">95%</span>
                </span>
                <div class="background">
                  <div class="bar"><div class="bar_in"></div></div>
                </div>
              </div>
              <div class="progress_inner" data-value="80" data-color="#ff214f">
                <span>
                  <span class="label">Brand Identity</span>
                  <span class="number">80%</span>
                </span>
                <div class="background">
                  <div class="bar"><div class="bar_in"></div></div>
                </div>
              </div>
              <div class="progress_inner" data-value="90" data-color="#ff214f">
                <span>
                  <span class="label">Javascript</span>
                  <span class="number">90%</span>
                </span>
                <div class="background">
                  <div class="bar"><div class="bar_in"></div></div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*** 04. About ***/

.grax_about {
  width: 100%;
  height: auto;
  clear: both;
  float: left;
  padding-bottom: 100px;
  position: relative;
  padding-top: 100px;
  background-color: #fff;
}
.grax_about .about_inner {
  width: 100%;
  height: auto;
  clear: both;
  float: left;
  display: flex;
}
.grax_about .about_inner .left {
  width: 40%;
  height: auto;
  padding-right: 10px;
}

.grax_about .about_inner .left .about_image_wrap {
  position: relative;
}
.grax_about .about_inner .left .about_image_wrap .image {
  position: absolute;
  z-index: 2;
}
.grax_about .about_inner .left .about_image_wrap .image .inner {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.grax_about .about_inner .left .about_image_wrap .border .inner {
  position: absolute;
  top: 25px !important;
  bottom: -25px !important;
  left: 25px !important;
  right: -25px !important;
  border: 10px solid #000;
}
.grax_about .about_inner .left .about_image_wrap img {
  opacity: 0;
}
.grax_about .about_inner .right {
  width: 60%;
  height: auto;
  padding-left: 50px;
}
.grax_about .about_inner .right .grax_tm_animation_text_word {
  color: #ff214f;
  font-size: 20px;
}
.grax_about .about_inner .right .title {
  width: 100%;
  float: left;
}
.grax_about .about_inner .right .title {
  margin-bottom: 22px;
}
.grax_about .about_inner .right .title span.top {
  font-family: 'Saira';
  display: inline-block;
  margin-bottom: 5px;
  color: #ff214f;
}
.grax_about .about_inner .right .title h3 {
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
}
.grax_about .about_inner .right .text {
  float: left;
  width: 100%;
  margin-bottom: 10px;
}
.grax_about .about_inner .right .text p {
  margin-bottom: 11px;
}
.grax_about .about_inner .right .buttons {
  float: left;
  width: 100%;
  display: flex;
  align-items: center;
}
.grax_about .about_inner .right .buttons .grax_button {
  width: auto;
}
.grax_about .about_inner .right .buttons .grax_button a:hover {
  color: #000000;
}
.grax_about .about_inner .right .buttons .grax_button:first-child {
  padding-right: 40px;
}
.grax_progress {
  width: 100%;
  height: auto;
  clear: both;
  float: left;
  margin-bottom: 9px;
}
.progress_inner {
  width: 100%;
  margin-bottom: 15px;
}
.progress_inner:last-child {
  margin-bottom: 31px;
}
.progress_inner > span {
  margin: 0px 0px 7px 0px;
  width: 100%;
  display: block;
  text-align: left;
  font-family: 'Saira';
}
.progress_inner span.label {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  font-family: 'Saira';
}
.progress_inner span.number {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #333;
  float: right;
  font-family: 'Saira';
}
.progress_inner .background {
  background: #07081f;
  width: 100%;
  min-width: 100%;
  position: relative;
  height: 8px;
}
.progress_inner .background .bar_in {
  height: 100%;
  background: #333;
  width: 0px;
  overflow: hidden;
}
.progress_inner .background .bar {
  width: 0px;
  height: 100%;
}
.progress_inner .background .bar.open {
  -webkit-animation: wow 3s cubic-bezier(0.165, 0.84, 0.44, 1); /* Safari 4+ */
  -moz-animation: wow 3s cubic-bezier(0.165, 0.84, 0.44, 1); /* Fx 5+ */
  animation: wow 3s cubic-bezier(0.165, 0.84, 0.44, 1); /* IE 10+ */
  width: 100%;
}

@-webkit-keyframes wow {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
@-moz-keyframes wow {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
@keyframes wow {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
