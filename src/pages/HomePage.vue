<template>
<div>
  <h1>Enter your URL below</h1>
  <input v-model="url"/>
  <button @click="onSubmit">Shorten!</button>

  <div>
    <button @click="onList">List All</button>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      url: ''
    }
  },
  methods: {
    onSubmit() {
      axios.post(
        '/shorten',
        {
          url: this.url
        }).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    onList() {
      axios.post(
        '/list',
        {

        }).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
