import { useEffect, useState } from "react"

import TableDinatran from "./components/TableDinatran";
import { getInformeDinatran } from "../../utils/dinatran";
import FormDate from "../../components/FormDate";

function Dinatran({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const [statistics, setStatistics] = useState({})

  const today = new Date()
  // Tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Last month ago
  const lastMonthAgo = new Date(today);
  lastMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(lastMonthAgo)
  const [endDate, setEndDate] = useState(tomorrow)


  const loadStatistics = async () => {
    const result = await getInformeDinatran(startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10))
      
    if (!result?.response  && !result?.message) {
      setStatistics(result)
    }
  }

  useEffect(() => {
    loadStatistics()
  }, [])


  const onClick = async () => {
    await loadStatistics()
  }

  return (
    <div className="p-4">
      <FormDate
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClick={onClick}
      />

      <TableDinatran
        statistics={statistics}
      />
      {Object.keys(statistics).length === 0 && (
        <p className="text-center p-4 text-lg">
          No hay datos
        </p>
      )}
    </div>
  )
}

export default Dinatran