<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    protected $fillable = ["name", "paranoid"];

    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}
