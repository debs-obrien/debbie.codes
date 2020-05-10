<template>
  <IfBot>
    <CookieConsent
      message="We use Cookies for user analysis and on-page improvements!"
      link-label="Learn about cookies"
    />
  </IfBot>
</template>

<script>
import IfBot from 'vue-if-bot/dist/vue-if-bot.es'
import CookieConsent from 'vue-cookieconsent-component/src/components/CookieConsent.vue'

export default {
  components: {
    IfBot,
    CookieConsent
  }
}
</script>

<style>
.cookie-consent {
  display: flex;
  padding: 10px;
  align-items: center;
  align-self: center;
  justify-content: center;
  border-bottom: 1px solid white;
  color: white;
}
.cookie-consent button {
  border: 1px solid white;
  padding: 10px;
  margin-left: 20px;
  min-width: 140px;
}
</style>
