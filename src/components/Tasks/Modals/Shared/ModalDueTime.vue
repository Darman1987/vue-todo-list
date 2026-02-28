<template>
  <div
    class="row q-mb-sm"
  >
    <q-input
      :value="dueTime"
      @input="$emit('update:dueTime', $event)"
      label="Due time"
      class="col"
      outlined
    >
      <template v-slot:append>
        <q-icon
          v-if="dueTime"
          @click="$emit('update:dueTime', '')"
          class="cursor-pointer"
          name="close"
        />
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy
            ref="qTimeProxy"
            transition-show="scale"
            transition-hide="scale"
            @before-show="onPopupShow"
          >
            <q-time
              :value="draftDueTime"
              @input="onTimeInput"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Cancel" color="primary" flat />
                <q-btn @click="applyDueTime" label="OK" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ['dueTime'],
  data () {
    return {
      draftDueTime: ''
    }
  },
  methods: {
    onPopupShow () {
      this.draftDueTime = this.dueTime
    },
    onTimeInput (value) {
      this.draftDueTime = value
    },
    applyDueTime () {
      this.$emit('update:dueTime', this.draftDueTime)
      this.$refs.qTimeProxy.hide()
    }
  }
}
</script>
