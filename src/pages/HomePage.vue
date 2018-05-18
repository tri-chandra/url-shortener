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
  <button :class="shortenClasses" @click="onSubmit">Shorten!</button>

  <p style= "margin-top: 20px;" v-show="shortenedUrl">
    Your url has been shortened:
    {{hostname}}/{{shortenedUrl}}
  </p>

  <p style= "margin-top: 20px;color: red;" v-show="errMsg">
    {{errMsg}}
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
      protocol: 'https://',
      isShortening: false,
      errMsg: ''
    }
  },
  computed: {
    hostname() {
      return `${window.location.protocol}//${window.location.host}`
    },
    shortenClasses() {
      if (this.isShortening) {
        return 'ui loading button'
      } else {
        return 'ui button'
      }
    }
  },
  methods: {
    changeProtocol(p) {
      this.protocol = p
    },
    onSubmit() {
      if (this.url.trim().length > 0) {
        this.errMsg = ''
        this.isShortening = true
        axios.post(
          '/shorten',
          {
            url: `${this.protocol}${this.url}`
          }
        ).then((response) => {
          this.shortenedUrl = response.data
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.isShortening = false
        })
      } else {
        this.errMsg = "Please provide a URL!"
      }
    }
  }
}
</script>
