import React from "react"
import PartProgress from "./PartProgress"

const CourseProgress = ({
  data,
  appliesForStudyRight,
  currentCourseVariant,
}) => {
  return (
    data &&
    (currentCourseVariant === "ohja-dl" ||
    currentCourseVariant === "ohja-nodl" ? (
      <div>
        {Object.entries(data).map(([name, data]) => {
          return (
            <PartProgress
              appliesForStudyRight={appliesForStudyRight}
              name={name}
              data={data}
            />
          )
        })}
      </div>
    ) : (
      <div>
        {Object.entries(data).map(([name, data]) => {
          if (name === "osa08") {
            return (
              <div>
                <PartProgress
                  appliesForStudyRight={appliesForStudyRight}
                  name={name}
                  data={data}
                />
              </div>
            )
          } else {
            return (
              <PartProgress
                appliesForStudyRight={appliesForStudyRight}
                name={name}
                data={data}
              />
            )
          }
        })}
      </div>
    ))
  )
}

export default CourseProgress
