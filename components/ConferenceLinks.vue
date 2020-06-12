<template>
  <div class="flex border border-gray-500 p-2 w-full">
    <div class="image-box flex flex-col max-width">
      <a class="justify-center" :href="url">
        <img
          class="w-100"
          :src="$url.conference(img)"
          :alt="alt"
          loading="lazy"
        />
      </a>
    </div>
    <div class="date-box p-2 ml-2 border-l border-gray-500 text-center">
      <div class="text-primary font-bold date">
        {{ showDay(date) }}
      </div>
      <div class="month">{{ showMonth(date) }}</div>
      <div class="year">{{ showYear(date) }}</div>
    </div>
    <div class="w-full p-2 ml-2 border-l border-gray-500">
      <div class="flex-col-reverse md:flex-row flex w-full justify-between">
        <a :href="url">
          <h2 class="text-xl mt-0 font-semibold">
            {{ name }} <span v-if="place" class="text-xs">{{ place }},</span>
            <span class="text-xs">{{ country }}</span>
          </h2>
        </a>
        <div
          class="font-Saira font-bold flex p-2 bg-white border-secondary rounded-lg text-primary"
        >
          <span>{{ type }}</span>
        </div>
      </div>

      <p v-if="talk">{{ talk }}</p>
      <p v-if="desc">{{ desc }}</p>

      <ul class="flex flex-col">
        <li v-if="slidesUrl">
          <a :href="slidesUrl">Slides</a>
        </li>
        <li v-if="notesUrl">
          <nuxt-link :to="notesUrl">Notes</nuxt-link>
        </li>
        <li v-if="blogUrl">
          <a :href="blogUrl">Blog Post</a>
        </li>
        <li v-if="videoUrl">
          <a :href="videoUrl">Video</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    img: {
      type: String,
      default: '',
      required: false
    },
    alt: {
      type: String,
      default: '',
      required: false
    },

    type: {
      type: String,
      default: '',
      required: true
    },
    name: {
      type: String,
      default: '',
      required: true
    },
    date: {
      type: String,
      default: '',
      required: true
    },
    place: {
      type: String,
      default: '',
      required: false
    },
    country: {
      type: String,
      default: '',
      required: false
    },
    url: {
      type: String,
      default: '',
      required: false
    },

    notesUrl: {
      type: String,
      default: '',
      required: false
    },
    blogUrl: {
      type: String,
      default: '',
      required: false
    },
    videoUrl: {
      type: String,
      default: '',
      required: false
    },
    talk: {
      type: String,
      default: '',
      required: false
    },
    desc: {
      type: String,
      default: '',
      required: false
    },
    slidesUrl: {
      type: String,
      default: '',
      required: false
    }
  },
  methods: {
    showDay(date) {
      const newDate = new Date(date)
      return newDate.getDate()
    },
    showMonth(date) {
      const newDate = new Date(date)
      const month = newDate.getMonth()
      if (month === 0) {
        return 'January'
      }
      if (month === 1) {
        return 'February'
      }
      if (month === 2) {
        return 'March'
      }
      if (month === 3) {
        return 'April'
      }
      if (month === 4) {
        return 'May'
      }
      if (month === 5) {
        return 'June'
      }
      if (month === 6) {
        return 'July'
      }
      if (month === 7) {
        return 'August'
      }
      if (month === 8) {
        return 'September'
      }
      if (month === 9) {
        return 'October'
      }
      if (month === 10) {
        return 'November'
      }
      if (month === 11) {
        return 'December'
      }
    },
    showYear(date) {
      const newDate = new Date(date)

      return newDate.getFullYear()
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 900px;
  margin: 0 auto;
}
.max-width {
  max-width: 130px;
}
.image-box,
.date-box {
  width: 160px;
}
.date {
  font-size: 2rem;
}
.month {
  font-size: 1.4rem;
}
</style>
