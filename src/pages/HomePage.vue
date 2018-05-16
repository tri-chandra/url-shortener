<template>
<div style="text-align: center;">
  <h1>Enter your URL below</h1>
  <div class="ui labeled input">
    <div class="ui simple dropdown label">
      <div class="text">{{protocol}}</div>
      <i class="dropdown icon"></i>
      <div class="menu">
        <div class="item" @click="changeProtocol('https://')">https://</div>
        <div class="item" @click="changeProtocol('http://')">http://</div>
        <div class="item" @click="changeProtocol('ftp://')">ftp://</div>
      </div>
    </div>
    <input placeholder="www.example.com" v-model="url"/>
  </div>
  <button class="ui button" @click="onSubmit">Shorten!</button>

  <p v-show="shortenedUrl">
    Your url has been shortened:
    {{hostname}}/{{shortenedUrl}}
  </p>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      url: '',
      shortenedUrl: '',
      protocol: 'https://'
    }
  },
  computed: {
    hostname() {
      return `${window.location.protocol}//${window.location.host}`
    }
  },
  methods: {
    changeProtocol(p) {
      this.protocol = p
    },
    onSubmit() {
      axios.post(
        '/shorten',
        {
          url: `${this.protocol}${this.url}`
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
