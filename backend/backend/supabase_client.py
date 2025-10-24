"""
Supabase REST API client for data operations
Uses HTTPS instead of direct PostgreSQL connection to bypass network issues
"""
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import httpx


class SupabaseClient:
    def __init__(self):
        self.base_url = os.getenv('SUPABASE_URL')
        self.api_key = os.getenv('SUPABASE_ANON_KEY')
        # Optional server-side service role key (useful to bypass RLS for
        # trusted server operations). Do NOT commit or expose this key.
        self.service_role = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        # Use the anon API key in the apikey header. Do NOT send it as an
        # Authorization Bearer token (Supabase will try to verify it as a JWT
        # and may return "invalid signature"). If you have a user JWT or the
        # service_role key, those should be sent in Authorization instead.
        self.headers = {
            'apikey': self.api_key,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    
    async def insert(self, table: str, data: Dict[str, Any], auth_token: Optional[str] = None) -> Optional[Dict]:
        """Insert a record into a table"""
        try:
            async with httpx.AsyncClient() as client:
                # Build headers per-request: prefer an explicit auth_token
                # (user JWT) if provided; otherwise use service_role if set;
                # otherwise fall back to anon apikey only.
                headers = self.headers.copy()
                if auth_token:
                    headers['Authorization'] = f'Bearer {auth_token}'
                elif self.service_role:
                    headers['apikey'] = self.service_role
                    headers['Authorization'] = f'Bearer {self.service_role}'

                response = await client.post(
                    f'{self.base_url}/rest/v1/{table}',
                    headers=headers,
                    json=data
                )
                if response.status_code in [200, 201]:
                    result = response.json()
                    return result[0] if isinstance(result, list) else result
                else:
                    print(f'Supabase insert error: {response.status_code} - {response.text}')
                    return None
        except Exception as e:
            print(f'Supabase insert exception: {e}')
            return None
    
    async def select(self, table: str, filters: Optional[Dict[str, Any]] = None, order_by: Optional[str] = None, auth_token: Optional[str] = None) -> List[Dict]:
        """Select records from a table"""
        try:
            url = f'{self.base_url}/rest/v1/{table}'
            params = {}
            
            if filters:
                for key, value in filters.items():
                    params[key] = f'eq.{value}'
            
            if order_by:
                params['order'] = order_by
            
            headers = self.headers.copy()
            if auth_token:
                headers['Authorization'] = f'Bearer {auth_token}'
            elif self.service_role:
                headers['apikey'] = self.service_role
                headers['Authorization'] = f'Bearer {self.service_role}'

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=headers,
                    params=params
                )
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f'Supabase select error: {response.status_code} - {response.text}')
                    return []
        except Exception as e:
            print(f'Supabase select exception: {e}')
            return []
    
    async def delete(self, table: str, id: str, auth_token: Optional[str] = None) -> bool:
        """Delete a record from a table"""
        try:
            headers = self.headers.copy()
            if auth_token:
                headers['Authorization'] = f'Bearer {auth_token}'
            elif self.service_role:
                headers['apikey'] = self.service_role
                headers['Authorization'] = f'Bearer {self.service_role}'

            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f'{self.base_url}/rest/v1/{table}?id=eq.{id}',
                    headers=headers
                )
                return response.status_code in [200, 204]
        except Exception as e:
            print(f'Supabase delete exception: {e}')
            return False
    
    async def update(self, table: str, id: str, data: Dict[str, Any], auth_token: Optional[str] = None) -> Optional[Dict]:
        """Update a record in a table"""
        try:
            headers = self.headers.copy()
            if auth_token:
                headers['Authorization'] = f'Bearer {auth_token}'
            elif self.service_role:
                headers['apikey'] = self.service_role
                headers['Authorization'] = f'Bearer {self.service_role}'

            async with httpx.AsyncClient() as client:
                response = await client.patch(
                    f'{self.base_url}/rest/v1/{table}?id=eq.{id}',
                    headers=headers,
                    json=data
                )
                if response.status_code == 200:
                    result = response.json()
                    return result[0] if isinstance(result, list) else result
                else:
                    print(f'Supabase update error: {response.status_code} - {response.text}')
                    return None
        except Exception as e:
            print(f'Supabase update exception: {e}')
            return None


# Global instance
supabase_client = SupabaseClient()
