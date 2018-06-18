export default `
<?xml version="1.0" encoding="utf-8"?>
<ApiResponse Status="OK" xmlns="http://api.namecheap.com/xml.response">
  <Errors />
  <Warnings />
  <RequestedCommand>namecheap.users.address.getlist</RequestedCommand>
  <CommandResponse Type="namecheap.users.address.getList">
    <AddressGetListResult>
      <List AddressId="0" AddressName="Primary Address" IsDefault="false" />
      <List AddressId="723837" AddressName="Art Deco Code" IsDefault="true" />
      <List AddressId="316205" AddressName="Private" IsDefault="false" />
    </AddressGetListResult>
  </CommandResponse>
  <Server>PHX01APIEXT02</Server>
  <GMTTimeDifference>--4:00</GMTTimeDifference>
  <ExecutionTime>0.014</ExecutionTime>
</ApiResponse>`.trim()
