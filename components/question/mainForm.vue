<template lang=pug>
  div()
    v-layout(justify-space-between)
      v-flex(grow) {{ question.description }}
      v-flex(shrink)
        v-btn(class="hint-button" @click="goToHint()") 助言
    v-sheet(color="grey lighten-3" height="50vh" style="overflow:scroll;")
      v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
        div(v-for="(stroke, i) in question.strokes" :key="i" class="stroke elevation-2" :style="`background-image: url('./strokes/${stroke.kind}');`")
          | x{{stroke.count}}
    v-layout(row align-center)
        v-flex(grow)
            v-text-field(v-model="answer" :rules="answerRules" :counter="1" required label="回答" reverse class="text-xs-right")
        v-flex(shrink)
          v-btn(class="btn-answer" @click="showSendDialog()" :disabled="!validAnswer") 送信
          v-dialog(v-model="doShowSendDialog" width="500")
            v-card
              v-card-title(class="headline grey lighten-2" primary-title) 回答を送信
              v-card-text(class="display-4 text-xs-center") {{ answer }}
              v-card-text(class="text-xs-center") 入力した漢字を回答として送信しますか？
              v-divider
              v-card-actions
                v-spacer
                v-btn(color="primary" flat @click="sendAnswer()") 送信
                v-btn(color="primary" flat @click="doShowSendDialog = false") 止める
</template>

<script>
import { STATUS } from './common'

export default {
  data() {
    return {
      doShowSendDialog: false,
      question: null,
      answer: '亜',
      answerRules: [v => v.length === 1 || '1文字だけ入力してください']
    }
  },
  computed: {
    validAnswer() {
      // 漢字文字の判定も行っている。
      return (
        this.answer.length === 1 &&
        /^[\u2e80-\u2fd5\u3192-\u319f\u3400-\u9fea\uf900-\ufa6d]$/.test(
          this.answer
        )
      )
    }
  },
  created() {
    this.question = {
      description: '下にある漢字の一画を組み立ててできる漢字は何でしょうか？',
      strokes: [
        { kind: 'stroke01.gif', count: 2 },
        { kind: 'stroke02.gif', count: 2 },
        { kind: 'stroke03.gif', count: 2 },
        { kind: 'stroke04.gif', count: 2 }
      ]
    }
  },
  methods: {
    goToHint() {
      this.$emit('change-status', STATUS.HINT)
    },
    sendAnswer() {
      this.$emit('change-status', STATUS.JUDGING)
    },
    showSendDialog() {
      this.doShowSendDialog =
        this.answerRules.filter(rule => rule(this.answer) !== true).length <= 0
    }
  }
}
</script>

<style lang="scss" scoped>
.hint-button {
  border-radius: 45%;
}

.strokes {
  width: 100%;
  height: 100%;
}
.stroke {
  width: 120px;
  height: 120px;
  background-size: cover;
  text-align: right;
  vertical-align: bottom;
}

.btn-answer {
  width: 100%;
}
</style>
