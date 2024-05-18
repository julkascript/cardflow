<p align="center">
  <img src="https://github.com/julkascript/cardflow/assets/59143945/9cfe53f6-051d-45b5-8411-e77a5dc06b97" alt="cardflow logo" width="128" />
  <br />
  <h1 align="center">Cardflow</h1>
</p>

## Getting started

Visit https://cardflow.market to get started with Cardflow!

## Who is using Cardflow?

Cardflow is an open-source Trading Card Game card market, currently supporting only "Yu-Gi-Oh!" cards. Buy, sell and trade quickly and easily with zero cost and taxes.

## Tech stack
 
<div>
  <table>
     <tr>
        <td><b>Frontend</b></td>
        <td><b>Backend</b></td>
     </tr>
     <tr>
       <td>
         <img src="https://github.com/julkascript/cardflow/assets/59143945/23b5372d-9764-4b45-8d28-0c678cba0889" alt="react logo" width="30" />
         <img src="https://github.com/julkascript/cardflow/assets/59143945/38da343e-353f-4321-8951-61652606b41f" alt="react logo" width="30" />
       </td>
        <td>
          <img src="https://github.com/julkascript/cardflow/assets/59143945/5f98bff6-93a0-4b17-be8e-0e2e26b94f9f" alt="react logo" width="30" />
          <img src="https://github.com/julkascript/cardflow/assets/59143945/f85df09f-2a3d-4249-b53b-2211c97c15cc" alt="react logo" width="30" />  
        </td>
     </tr>
  </table>
</div>

## Setting up Cardflow for development

1. `git clone git@github.com:julkascript/cardflow.git .`
2. `cp sample.env .env && cp backend/sample.env backend/.env && cp frontend/sample.env frontend/.env`
3. `docker compose up -d --build`
5. You most likely want to seed data, so you can have cards to work with.
    - `docker ps` to see the containers
    - `docker exec -it <backend_container_id> sh`
    - `python manage.py seed staple`
6. Visit Cardflow at `localhost:5173`

## Feel like contributing?

Check out our [guideline document](https://github.com/julkascript/cardflow/blob/develop/CONTRIBUTING.md) and start contributing right away!
