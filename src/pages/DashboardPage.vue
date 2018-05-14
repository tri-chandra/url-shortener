<template>
<div>
  <h2>Dashboard</h2>
  <div>
    <button @click="onList">List All</button>
    <button @click="onList">Backup Memcache</button>
  </div>
  <div class="ui relaxed divided list">
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
          http://localhost:8180/{{item.key}}
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
      urlList: []
    }
  },
  methods: {
    onList() {
      axios.post(
        '/list',
        {

        }
      ).then((response) => {
        this.urlList = response.data
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
