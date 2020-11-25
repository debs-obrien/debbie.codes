<template>
  <footer class="flex flex-col mt-20 px-4 py-6">
    <div>
      <ColorModePicker />
      <footer class="text-center mt-8">
        <p class="mb-4">
          © Debbie O'Brien, Palma de Mallorca, Spain
        </p>
        <ul class="flex justify-center">
          <li class="mx-2">
            <a href="https://twitter.com/debs_obrien">
              <IconTwitter class="h-10 w-10 fill-current" />
            </a>
          </li>
          <li class="mx-2">
            <a href="https://www.linkedin.com/in/debbie-o-brien-1a199975/">
              <IconLinkedIn class="h-10 w-10 fill-current" />
            </a>
          </li>
          <li class="mx-2">
            <a href="https://www.youtube.com/channel/UCrNvYFsT1L3WczE8AizDQ6g/">
              <IconYouTube class="h-10 w-10 fill-current" />
            </a>
          </li>
          <li class="mx-2">
            <a href="https://github.com/debs-obrien">
              <IconGithub class="h-10 w-10 fill-current" />
            </a>
          </li>
          <li class="mx-2">
            <a href="https://noti.st/debbie">
              <IconSpeaker class="h-10 w-10 fill-current" />
            </a>
          </li>

          <li class="mx-2">
            <a href="mailto:debbie@nuxt.com">
              <IconEmail class="h-10 w-10 fill-current" />
            </a>
          </li>
          <li class="mx-2">
            <a href="https://www.buymeacoffee.com/debbieobrien">
              <IconCoffee class="h-10 w-10 fill-current" />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  </footer>
</template>
<script>
  import IconEmail from '@/assets/icons/email.svg?inline'
  import IconGithub from '@/assets/icons/github.svg?inline'
  import IconTwitter from '@/assets/icons/twitter.svg?inline'
  import IconLinkedIn from '@/assets/icons/linkedIn.svg?inline'
  import IconYouTube from '@/assets/icons/youtube.svg?inline'
  import IconSpeaker from '@/assets/icons/speaker.svg?inline'
  import IconCoffee from '@/assets/icons/coffee.svg?inline'
  export default {
    components: {
      IconEmail,
      IconGithub,
      IconTwitter,
      IconLinkedIn,
      IconYouTube,
      IconSpeaker,
      IconCoffee
    }
  }
</script>

<style scoped></style>
