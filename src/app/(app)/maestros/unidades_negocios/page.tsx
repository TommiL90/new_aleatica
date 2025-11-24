import { fetchBusinessUnits } from '@/features/masters/ business-unit/actions/fetch-business-units';
import React from 'react'

const UnidadesNegociosPage = async () => {

  const data = await fetchBusinessUnits();
  return (
    <div>
      <pre>
        <code>
          {JSON.stringify(data, null, 2)}
        </code>
      </pre>
    </div>
  )
}

export default UnidadesNegociosPage