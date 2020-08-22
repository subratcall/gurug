import axios from "axios"
import { accessToken } from "./moocfi"
import { flatten, getCommonElements } from "../util/arrays"

const BASE_URL = "https://quiznator.mooc.fi"

export async function fetchManyQuizDetails(quizIds) {
  const res = await axios.post(
    `${BASE_URL}/api/v1/quizzes/stripped`,
    { quizIds },
    { headers: { Authorization: `Bearer ${accessToken()}` } },
  )
  return res.data
}

export async function fetchQuizProgress() {
  let res = []
  const partToTag = [
    {
      part: "osa01",
      tag: "tietokoneen-toiminnan-jatkokurssi-1",
    },
    {
      part: "osa02",
      tag: "tietokoneen-toiminnan-jatkokurssi-2",
    },
    {
      part: "osa03",
      tag: "tietokoneen-toiminnan-jatkokurssi-3",
    },
    {
      part: "osa04",
      tag: "tietokoneen-toiminnan-jatkokurssi-4",
    },
    {
      part: "osa05",
      tag: "tietokoneen-toiminnan-jatkokurssi-5",
    },
    {
      part: "osa06",
      tag: "tietokoneen-toiminnan-jatkokurssi-6",
    },
    {
      part: "osa07",
      tag: "tietokoneen-toiminnan-jatkokurssi-7",
    },
    {
      part: "osa08",
      tag: "tietokoneen-toiminnan-jatkokurssi-8",
    },
    {
      part: "osa09",
      tag: "tietokoneen-toiminnan-jatkokurssi-9",
    },
    {
      part: "osa10",
      tag: "tietokoneen-toiminnan-jatkokurssi-10",
    },
    {
      part: "osa11",
      tag: "tietokoneen-toiminnan-jatkokurssi-11",
    },
    {
      part: "osa12",
      tag: "tietokoneen-toiminnan-jatkokurssi-12",
    },
    {
      part: "osa13",
      tag: "tietokoneen-toiminnan-jatkokurssi-13",
    },
    {
      part: "osa14",
      tag: "tietokoneen-toiminnan-jatkokurssi-14",
    },
  ]
  const quizIdInformation = await fetchQuizIds()
  const allQuizIds = flatten(quizIdInformation.map(o => o.quizIds))
  const progress = await fetchProgressByQuizIds(allQuizIds)
  const allAnswered = (progress.answered || []).map(o => o._id)
  partToTag.forEach(({ part, tag }) => {
    const relevant = quizIdInformation
      .filter(o => {
        return o.tags.indexOf(tag) !== -1
      })
      .map(o => o.quizIds)
    const quizIds = flatten(relevant)
    const answered = getCommonElements(quizIds, allAnswered)
    const maxPoints = quizIds.length
    const nPoints = answered.length
    const progress = Math.floor((nPoints / maxPoints) * 100) / 100
    res = res.concat({
      group: part,
      max_points: maxPoints,
      n_points: nPoints,
      progress,
    })
  })

  return res
}

export async function fetchQuizIds() {
  const res = await axios.post(
    `${BASE_URL}/api/v1/tags/quizids`,
    { tags: ["tietokoneen-toiminnan-jatkokurssi"] },
    { headers: { Authorization: `Bearer ${accessToken()}` } },
  )
  return res.data
}

async function fetchProgressByQuizIds(quizIds) {
  const res = await axios.post(
    `${BASE_URL}/api/v1/answerers/progress`,
    { quizIds },
    { headers: { Authorization: `Bearer ${accessToken()}` } },
  )
  const data = res.data
  return data
}
