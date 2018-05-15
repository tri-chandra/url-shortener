<template>
<div>
  <h2>Dashboard</h2>
  <div>
    <button @click="onList">List All</button>
    <button @click="onBackup">Backup Memcache</button>
  </div>
  <div v-if="noUrl">
    Memory cache is currently empty
  </div>
  <div v-else class="ui relaxed divided list">
    <div
      v-for="item in urlList"
      :key="item.key"
      class="item">
      <div class="content">
        <a class="header">
          {{item.url}}
        </a>
        <a
          class="description"
          :href="`http://localhost:8180/${item.key}`"
          target="_blank">
          {{hostname}}/{{item.key}}
        </a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      urlList: [],
      noUrl: false
    }
  },
  computed: {
    hostname() {
      return `${window.location.protocol}//${window.location.host}`
    }
  },
  methods: {
    onList() {
      axios.post(
        '/list',
        {

        }
      ).then((response) => {
        if ('ERR' === response.data.code) {
          this.noUrl = true
        } else {
          this.urlList = response.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onBackup() {
      axios.post(
        '/backup',
        {

        }
      ).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
