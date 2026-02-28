<template>
  <div class="row q-mb-sm">
    <q-input
      :value="dueDate"
      @input="$emit('update:dueDate', $event)"
      label="Due date"
      outlined
    >
      <template v-slot:append>
        <q-icon
          v-if="dueDate"
          @click="$emit('clear')"
          class="cursor-pointer"
          name="close"
        />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
            @before-show="onPopupShow"
          >
            <q-date
              :value="draftDueDate"
              @input="draftDueDate = $event"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Cancel" color="primary" flat />
                <q-btn @click="applyDueDate" label="OK" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ['dueDate'],
  data () {
    return {
      draftDueDate: ''
    }
  },
  methods: {
    onPopupShow () {
      this.draftDueDate = this.dueDate
    },
    applyDueDate () {
      this.$emit('update:dueDate', this.draftDueDate)
      this.$refs.qDateProxy.hide()
    }
  }
}
</script>
