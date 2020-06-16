/*jshint esversion: 9 */

function random2( p ) {
    const a = new Vector2(127.1,311.7);
    const b = new Vector2(269.5,183.3);
    return new Vector2(p.dot(a), p.dot(b)).sin().mult(43758.5453).fract();
}

function clamp(x, a, b) {
  if(x < a) return a;
  if(x > b) return b;
  return x;
}

function smoothstep(edge0, edge1, x) {
  // Scale, bias and saturate x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * (3 - 2 * x);
}

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y =y;
  }

  floor() {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  fract() {
    return new Vector2(this.x - Math.floor(this.x), this.y - Math.floor(this.y));
  }

  sin() {
    return new Vector2(Math.sin(this.x), Math.sin(this.y));
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  mult(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  div(scalar, s2) {
    const sc2 = s2 === undefined ? scalar : s2;
    return new Vector2(scalar == 0 ? 0 : this.x / scalar, sc2 == 0 ? 0 : this.y / sc2);

  }

  sqrt() {
    return new Vector2(Math.sqrt(this.x), Math.sqrt(this.y));
  }

  magnitude() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  normalize() {
    return this.div(this.magnitude());
  }
}

class SimplexSampler {
  constructor(seed) {
    this.simplex = new SimplexNoise(seed);
  }
  getNoise(x, y) {
    return this.simplex.noise2D(x, y);
  }
}

class VoronoiSampler {
  constructor(noiseSampler, options = {}) {
    this.noiseSampler = noiseSampler;
    this.options = { ... {
      amplitude: 1,
      persistence: 0.5,
      frequency: 1,
      octaves: 4
    }, ... options };
  }

voronoi2( x, y)
{
  const vectX = new Vector2(x, y);
  const p = vectX.floor();
  const f = vectX.fract();
  let m_dist  = 1;
    let res = new Vector2( 8.0, 8.0 );
    for( let j=-1; j<=1; j++ )
    for( let i=-1; i<=1; i++ )
    {
        const b = new Vector2(i, j);
        const point = random2(p.add(b));
        const diff = b.add(point).sub(f);
        const dist = diff.magnitude();

        m_dist = Math.min(dist, m_dist);
    }

    return m_dist;
}

voronoi( x, y)
{
  const vectX = new Vector2(x, y);
  const p = vectX.floor();
  const f = vectX.fract();

    let res = new Vector2( 8.0, 8.0 );
    for( let j=-1; j<=1; j++ )
    for( let i=-1; i<=1; i++ )
    {
        const b = new Vector2(i, j);
        const point = random2(p.add(b));
        const diff = b.add(point).sub(f);
        const d = diff.dot(diff);

        if( d < res.x )
        {
            res.y = res.x;
            res.x = d;
        }
        else if( d < res.y )
        {
            res.y = d;
        }
    }

    return res.sqrt();
}

  voronoiDistance( x, y )
  {
    const vectX = new Vector2(x, y);
    const p = vectX.floor();
    const f = vectX.fract();

      let mb;
      let mr;

      let res = 8.0;
      for( let j=-1; j<=1; j++ )
      for( let i=-1; i<=1; i++ )
      {
          const b = new Vector2(i, j);
          const point = random2(p.add(b));
          const diff = b.add(point).sub(f);
          const d = diff.dot(diff);

          if( d < res )
          {
              res = d;
              mr = diff;
              mb = b;
          }
      }

      res = 8.0;
      for( let j=-2; j<=2; j++ )
      for( let i=-2; i<=2; i++ )
      {
          const b = mb.add(new Vector2(i, j));
          const point = random2(p.add(b));
          const diff = b.add(point).sub(f);
          const dd = mr.add(diff).mult(0.5);
          const nd = diff.sub(mr).normalize();
          const d = dd.dot(nd); // dot(0.5*(mr+r), normalize(r-mr));
          if (d != 0) res = Math.min( res, d );
      }

      return res;
  }

}

class FBMSampler {
  constructor(noiseSampler, options = {}) {
    this.noiseSampler = noiseSampler;
    this.options = { ... {
      amplitude: 1,
      persistence: 0.5,
      frequency: 1,
      octaves: 4
    }, ... options };
  }

  getNoise(x, y) {
    let total = 0;
    let maxValue = 0;
    let amplitude = this.options.amplitude;
    let frequency = this.options.frequency;
    for (let i = 0; i < this.options.octaves; i++)
    {
        total += this.noiseSampler.getNoise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= this.options.persistence;
        frequency *= 2;
    }
    return total / maxValue;
  }

}
