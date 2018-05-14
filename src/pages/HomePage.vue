<template>
<div style="text-align: center;">
  <h1>Enter your URL below</h1>
  <input v-model="url"/>
  <button @click="onSubmit">Shorten!</button>

  <p v-show="shortenedUrl">
    Your url has been shortened:
    http://localhost:8180/{{shortenedUrl}}
  </p>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      url: '',
      shortenedUrl: ''
    }
  },
  methods: {
    onSubmit() {
      axios.post(
        '/shorten',
        {
          url: this.url
        }
      ).then((response) => {
        this.shortenedUrl = response.data
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
