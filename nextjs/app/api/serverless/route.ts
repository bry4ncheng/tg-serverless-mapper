import { NextResponse } from 'next/server';
import * as redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL, 
});

export async function POST(req: Request) {
  try {
      await client.connect();
      const id = makeId(10);
      let body = await req.json();
      //pubkey, hash, network
      const data = {
        pubkey: body.pubkey,
        hash: body.hash,
        network: body.network
      }
      await client.set(id , JSON.stringify(data), {EX: 60*60*24})
      await client.quit();

      return NextResponse.json(id,  { status: 200 });
  } catch(e) {
      console.log("DIED ", e);
      return NextResponse.json({},  { status: 400 });
  }
}

function makeId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}