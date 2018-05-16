<template>
<div>
  <h2>Dashboard</h2>
  <div>
    <button :class="listClasses" @click="onList">List All</button>
    <button :class="backupClasses" @click="onBackup">Backup Memcache</button>
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
          :href="`/${item.key}`"
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
      noUrl: false,
      isLoadingList: false,
      isBackingup: false
    }
  },
  computed: {
    hostname() {
      return `${window.location.protocol}//${window.location.host}`
    },
    listClasses() {
      if (this.isLoadingList) {
        return 'ui basic teal loading button'
      } else {
        return 'ui basic teal button'
      }
    },
    backupClasses() {
      if (this.isBackingup) {
        return 'ui basic green loading button'
      } else {
        return 'ui basic green button'
      }
    }
  },
  methods: {
    onList() {
      this.isLoadingList = true
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
      }).finally(() => {
        this.isLoadingList = false
      })
    },
    onBackup() {
      this.isBackingup = true
      axios.post(
        '/backup',
        {

        }
      ).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.isBackingup = false
      })
    }
  }
}
</script>
