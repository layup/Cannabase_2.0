import React from 'react'

const ThcSampleSection = ({clientInfo, updateSampleName, updateSampleOptions, samples, sampleOptions}) => {

    console.log(samples)

    return (
        <div className='w-full h-full scroll-auto'>
            <table className='table-fixed w-full'>
                <thead className='bg-emerald-700 text-white'>
                    <tr className='[&>*]:font-normal [&>th]:p-2 text-sm text-left'>
                        <th>Sample Name</th>
                        <th>Units</th>
                        <th>Basic/Deluxe</th>
                        <th>Single/Multi</th>
                        <th>De/Un/Mo</th>
                        <th>Sample Name</th>
                    </tr>
                </thead>

                
                <tbody className='text-sm'>
                {samples && sampleOptions && samples.map((sampleName) => {
                  let jobNum = sampleName.substr(0,6)
                 
                  return (
                    <tr key={sampleName} className='border-b-1 border-zinc-200'>
                      <td className='text-center p-2'>{sampleName}</td>
                      <td>
                        <select 
                          value={sampleOptions[sampleName]['unitType']} 
                          className='w-5/6 p-1 bg-zinc-200 rounded-md'
                          onChange={(e) => updateSampleOptions(sampleName, 'unitType',e.target.value)}
                        >
                          <option value="moisture">mg/g & Percent (Moisture)</option>
                          <option value="density">mg/ml & Percent(Density)</option>
                          <option value="unitMass">mg/unit & mg/g (Unit Mass)</option>
                          <option value="percentage">Percent Only</option>
                        </select>
                      </td>
                      <td>
                      <select 
                        value={sampleOptions[sampleName]['reportType']} 
                        className='w-5/6 p-1 bg-zinc-200 rounded-md'
                        onChange={(e) => updateSampleOptions(sampleName, 'reportType',e.target.value)}
                      >
                        <option value="basic">Basic Report</option>
                        <option value="deluxe">Deluxe Report</option>
                      </select>
                    </td>
                      <td>
                        <select 
                          value={sampleOptions[sampleName]['amount']} 
                          className='w-5/6 p-1 bg-zinc-200 rounded-md'
                          onChange={(e) => updateSampleOptions(sampleName, 'amount',e.target.value)}
                        >
                          <option value="single">Single</option>
                          <option value="mult">Multiple</option>
                        </select>
                      </td>
        
                      <td>
                        <input 
                          value={
                          ""
                          } 
                          className="bg-zinc-200 w-11/12 h-full p-1 rounded-md" 
                          
                        />  
                      </td>
        
                      <td>
                        <input 
                          value={
                            clientInfo[jobNum]['sampleNames'][sampleName] ? clientInfo[jobNum]['sampleNames'][sampleName]: ""
                          } 
                          className="bg-zinc-200 w-11/12 h-full p-1 rounded-md" 
                          onChange={(e) => updateSampleName(jobNum, "sampleNames", e.target.value, sampleName)}
                        />  
                      </td>
                    </tr> 
                  )
                })}          
                 
                
                </tbody>
                
            </table>
        </div>
    )
}

export default ThcSampleSection