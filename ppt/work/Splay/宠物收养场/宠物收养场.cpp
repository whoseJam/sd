#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const ll N=1000000;
const ll Mod=1000000;
const ll inf=1e15;

ll n,ans;
set<ll> animal;
set<ll> person;

void find(set<ll>& s,ll x) {
	auto next=s.lower_bound(x);
	if(*next==x){
		s.erase(next);
		return;
	}
	// *next > x
	// *prev < x
	auto prev=next;
	prev--;
	ll dnext=(*next)-x;
	ll dprev=x-(*prev);
	if(dprev<=dnext){
		s.erase(prev);
		ans=(ans+dprev)%Mod;
	}else{
		s.erase(next);
		ans=(ans+dnext)%Mod;
	}
}

void init(set<ll>& s){
	s.insert(-inf);
	s.insert(+inf);
}

int main(){
	scanf("%lld",&n);
	init(animal);
	init(person);
	for(ll i=1;i<=n;i++){
		ll a,b;
		scanf("%lld%lld",&a,&b);
		if(a==1){ // this is a person
			if(animal.size()>2)find(animal,b);
			else person.insert(b);
		}else{
			if(person.size()>2)find(person,b);
			else animal.insert(b);
		}
	}
	printf("%lld\n",ans);
	return 0;
}
